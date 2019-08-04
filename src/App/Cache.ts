interface IUnitStorage {
  expires: number;
  data: any;
}

interface IFolder {
  [key: string]: IUnitStorage;
}

interface IStorage {
  [key: string]: IFolder;
}

class Cache {
  protected expires = +process.env.CACHE_EXPIRES || 86400;
  protected limit = +process.env.CACHE_LIMIT || 1000;

  private storage: IStorage = {};

  public set(path: string, key: string, object: any) {
    if (!this.storage[path]) {
      this.storage[path] = {};
    }

    if (Object.keys(this.storage[path]).length === this.limit) {
      this.clearExpired(path);
    }

    const unit: IUnitStorage = {
      expires: new Date().setSeconds(new Date().getSeconds() + this.expires),
      data: object
    };

    this.storage[path][`${key}`] = unit;
  }

  public get(path: string, key?: string): any {
    if (!this.storage[path]) {
      return null;
    }

    if (key) {
      const unit = this.storage[path][`${key}`];
      if (unit && this.checkUnit(unit)) {
        return this.storage[path][`${key}`].data;
      } else {
        delete this.storage[path][`${key}`];
        return null;
      }
    } else {
      const units = this.storage[path];
      Object.keys(units).forEach((keyUnit) => {
        if (!this.checkUnit(units[keyUnit])) {
          delete this.storage[path][`${keyUnit}`];
          delete units[keyUnit];
        }
      });
      if (Object.keys(units).length === 0) {
        return null;
      } else {
        return Object.values(units).map((unit) => unit.data);
      }
    }

  }

  public checkUnit(unit: IUnitStorage) {
    if (unit.expires < new Date().getTime()) {
      return false;
    } else {
      return true;
    }
  }

  public clear(path: string = null, key: string = null) {
    if (path) {
      if (key) {
        if (this.storage[path][key]) {
          delete this.storage[path][key];
        }
      } else {
        if (this.storage[path]) {
          delete this.storage[path];
        }
      }
    } else {
      this.storage = {};
    }
  }

  public clearExpired(path: string) {
    Object.keys(this.storage[path]).forEach((key) => {
      if (this.storage[path][key].expires < new Date().getTime()) {
        delete this.storage[key];
      }
    });
  }

  public getKeyOutDated(path: string): string {
    let min = Infinity;
    let keyOfo: string = null;
    Object.keys(this.storage[path]).forEach((key) => {
      if (this.storage[path][key].expires < min) {
        min = this.storage[path][key].expires;
        keyOfo = key;
      }
    });
    return keyOfo;
  }
}

export const MemoryCache = new Cache();

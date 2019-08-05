import axios from 'axios';
import iconv from 'iconv-lite';
import {JSDOM} from 'jsdom';
import md5 from 'md5';
import { MemoryCache } from '~/App/Cache';

export interface IFilmInfo {
  name?: string;
  year?: string;
  country?: string;
  tagline?: string;
  mainproducer?: string;
  actors?: string;
  producer?: string;
  screenwriter?: string;
  genre?: string;
  duration?: string;
  startdate?: string;
  budget?: string;
  [key: string]: string;
}

export default class Premiercinema {
  private readonly urlMonth = 'http://premiercinema.ru/affiche/';
  private readonly urlNextMonth = 'http://premiercinema.ru/affiche/nextmonth/';

  private readonly cachePath = 'services/cinemas/premiercinema';

  private readonly mapTableFilmInfo: {[key: string]: string} = {
    year: 'Год',
    country: 'Страна',
    tagline: 'Слоган',
    mainproducer: 'Режиссер',
    actors: 'Актеры',
    producer: 'Продюсеры',
    screenwriter: 'Сценаристы',
    genre: 'Жанр',
    duration: 'Продолжительность',
    startdate: 'В прокате',
    budget: 'Бюджет',
  };

  public async getPosterToday(): Promise<IFilmInfo[]> {
    return this.getPoster(this.urlMonth);
  }

  public async getPosterFuture(): Promise<IFilmInfo[]> {
    return this.getPoster(this.urlNextMonth);
  }

  protected async getPoster(url: string): Promise<IFilmInfo[]> {
    const cacheResult = MemoryCache.get(this.cachePath, md5(url));
    if (cacheResult) {
      return cacheResult;
    }

    const html = (await axios.get(url, {responseType: 'arraybuffer'})).data;

    const uhtml = iconv.encode(iconv.decode(html, 'win1251'), 'utf8').toString();
    const dom = new JSDOM(uhtml);
    const document = dom.window.document;
    const $filmdescList = document.getElementsByClassName('filmdesc');

    const result = [];
    for (const $filmdesc of $filmdescList) {
      const data: IFilmInfo = {};
      data.name = $filmdesc.getElementsByClassName('film-title')[0].getElementsByTagName('a')[0].text;
      const $tableInfo = $filmdesc.getElementsByClassName('film-table')[0].getElementsByTagName('table')[0];
      for (const $tr of $tableInfo.getElementsByTagName('tr')) {
        const trkey = $tr.getElementsByTagName('td')[0].textContent.trim();
        const trvalue = $tr.getElementsByTagName('td')[1].textContent.trim();
        const key = Object.keys(this.mapTableFilmInfo).find((mapkey: string) => this.mapTableFilmInfo[mapkey] === trkey);
        data[key] = trvalue;
      }
      result.push(data);
    }

    MemoryCache.set(this.cachePath, md5(url), result);
    return result;
  }

}

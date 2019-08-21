export default class Helper {
  /**
   * Метод flat() возвращает новый массив,
   * в котором все элементы вложенных
   * подмассивов были рекурсивно "подняты"
   * на указанный уровень depth.
   * @param arr массив
   */
  public static flat(arr: any[]): any[] {
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(Helper.flat(val)) : acc.concat(val), []);
 }

  /**
   * Возвращает случайное число
   * @param min минимальное значение
   * @param max максимальное значение
   */
  public static randomNumber(min: number, max: number): number {
    const rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }
}

import Axios from "axios";

/**
 * Функция возвращает внешний ip адрес
 */
export default async function getExternalIp(): Promise<string> {
  return (await Axios.get('https://ifconfig.co/ip')).data.trim();
}

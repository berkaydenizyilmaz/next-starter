import {
  DARK_THEME_CLASS,
  THEME,
  THEME_STORAGE_KEY,
} from '@/components/theme/theme.constants';

const key = JSON.stringify(THEME_STORAGE_KEY);
const darkClass = JSON.stringify(DARK_THEME_CLASS);
const dark = JSON.stringify(THEME.DARK);
const light = JSON.stringify(THEME.LIGHT);

export const THEME_SCRIPT = `(function(){var m=matchMedia("(prefers-color-scheme: dark)");function a(){var t;try{t=localStorage.getItem(${key})}catch(e){t=null}document.documentElement.classList.toggle(${darkClass},t===${dark}||(t!==${light}&&m.matches))}a();m.addEventListener("change",a);addEventListener("storage",function(e){if(e.key===${key})a()})})()`;

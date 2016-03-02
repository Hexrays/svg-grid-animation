/* jshint devel:true */
import {App} from './app';

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
   App.init();
  }
};

// var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';

export function createRandomRGB(alpha=1) {
  return `rgba(${(Math.floor(Math.random() * 256))},${(Math.floor(Math.random() * 256))},${(Math.floor(Math.random() * 256))},${alpha})`;
}

export function convertToSnake (str) {
  let strArr = str.split(''),
      isLastUppercase = false;
  for (let ltr in strArr) {
    if (!isLastUppercase && strArr[ltr] === strArr[ltr].toUpperCase() && typeof(strArr[ltr]) !== 'number') {
      strArr[ltr] = '-' + strArr[ltr].toLowerCase();
      isLastUppercase = true;
    } else if (strArr[ltr] === strArr[ltr].toUpperCase() && typeof(strArr[ltr]) !== 'number') {
      strArr[ltr] = strArr[ltr].toLowerCase();
      isLastUppercase = true;
    } else {
      isLastUppercase = false;
    }
  }
  return strArr.join('');
}

export function addNewClass (el, newClass) {
  if (el.classList){
    el.classList.add(newClass);
  } else {
    el.className += ' ' + newClass;
  }
}

export function removeClass (el, className) {
  if (el.classList){
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

export function hasClass(el, className) {
  if (el.classList){
    return el.classList.contains(className);
  }
  else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
}

export function removeFromArray(arr, elm) {
  let index = arr.indexOf(elm);
  if (index > -1) {
    arr.splice(index,1);
  }
}

export function checkObjectInArray(obj, array) {
  let element;
  for (element in array) {
    if (array.hasOwnProperty(element) && array[element] === obj) {
      return true;
    }
  }
  return false;
}

export function isBetween(num, min, max) {
  return num >= min && num <= max;
}

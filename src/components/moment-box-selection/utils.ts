/**
 * @Description: utils
 * @Author: zfh <zhangfuhao@mininglamp.com>
 * @Date: 2020-11-18 14:04:00
 * @LastEditor: zfh <zhangfuhao@mininglamp.com>
 * @LastEditTime: 2020-11-18 14:04:00
 */
function getTop(e: any) {
  let offset = e.offsetTop;
  if (e.offsetParent != null) offset += getTop(e.offsetParent);
  return offset;
}

function getLeft(e: any) {
  let offset = e.offsetLeft;
  if (e.offsetParent != null) offset += getLeft(e.offsetParent);
  return offset;
}

function clearEventBubble(e: any) {
  if (e.stopPropagation) e.stopPropagation();
  else e.cancelBubble = true;

  if (e.preventDefault) e.preventDefault();
  else e.returnValue = false;
}

function scroll() {
  if (window.pageYOffset) {
    return {
      scrollLeft: window.pageXOffset,
      scrollTop: window.pageYOffset,
    };
  }
  if (document.compatMode === 'CSS1Compat') {
    return {
      scrollLeft: document.documentElement.scrollLeft,
      scrollTop: document.documentElement.scrollTop,
    };
  }

  return {
    scrollLeft: document.body.scrollLeft,
    scrollTop: document.body.scrollTop,
  };
}

function isInPath(target: any, wrapper: any) {
  const iOffLeft = target.offsetLeft;
  const iOffTop = target.offsetTop;
  const iLeft = target.offsetWidth + iOffLeft;
  const iTop = target.offsetHeight + iOffTop;

  if (
    iLeft > wrapper.left &&
    iTop > wrapper.top &&
    iOffLeft < wrapper.left + wrapper.width &&
    iOffTop < wrapper.top + wrapper.height
  ) {
    return true;
  }
  return false;
}

function getParents(el: any, parentTag: string) {
  if (parentTag === undefined) {
    return el.parentNode;
  }
  let result = el.parentNode;

  if (!result || !result.targetName) {
    return result;
  }

  while (result.tagName !== parentTag) {
    const o = result;
    result = o.parentNode;
  }

  return result;
}
// 数字与周几对应
const formatInvertWeekDay = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};
function formatWeekDay(day: number) {
  switch (day) {
    case 1:
      return {
        week: '周一',
        enDate: 'Mon',
      };
    case 2:
      return {
        week: '周二',
        enDate: 'Tue',
      };
    case 3:
      return {
        week: '周三',
        enDate: 'Wed',
      };
    case 4:
      return {
        week: '周四',
        enDate: 'Thu',
      };
    case 5:
      return {
        week: '周五',
        enDate: 'Fri',
      };
    case 6:
      return {
        week: '周六',
        enDate: 'Sat',
      };
    default:
      return {
        week: '周日',
        enDate: 'Sun',
      };
  }
}

export default {
  getParents,
  isInPath,
  scroll,
  clearEventBubble,
  getLeft,
  getTop,
  formatWeekDay,
  formatInvertWeekDay,
};

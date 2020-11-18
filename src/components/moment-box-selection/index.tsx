/**
 * @Description: 时刻选择器
 * @Author: zfh <zhangfuhao@mininglamp.com>
 * @Date: 2020-11-18 14:04:00
 * @LastEditor: zfh <zhangfuhao@mininglamp.com>
 * @LastEditTime: 2020-11-18 14:04:00
 */
import { forEach, includes, size, map } from 'lodash-es';
import React, { useEffect, useRef, useState } from 'react';

import styles from './index.less';
import _ from './utils';

interface TSelectionProps {
  cols?: number;
  rows?: number;
  width?: number;
  height?: number;
  gap?: number;
  selected: string[];
  onSelected: (selectedPostions: string[]) => void;
  wrapperScroll?: { [key: string]: number };
  onMounted?: (items: any[]) => void;
  onHovered?: (datasetElement: string | undefined, target: any) => void;
  onLeaved?: (datasetElement: string | undefined, target: any) => void;
}

const MomentBoxSelection = (props: TSelectionProps) => {
  const {
    cols = 24,
    rows = 7,
    width = 30,
    height = 30,
    gap: margin = 0,
    selected = [],
    onMounted,
    onHovered,
    onLeaved,
    onSelected,
    wrapperScroll = { scrollLeft: 0, scrollTop: 0 },
  } = props;
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedPostions, setSelectedPostions] = useState<any[]>([]);
  const [templates] = useState(() => {
    return map([...Array(props.rows || 7)], () => [
      ...Array(props.cols || 24).keys(),
    ]);
  });

  const [start, setStart] = useState({
    startX: 0,
    startY: 0,
  });

  const selectionTable = useRef<any>(null);

  const [selectEle, setSelectEle] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    display: 'none',
  });

  useEffect(() => {
    if (selectionTable && selectionTable.current) {
      const items = [...selectionTable.current?.getElementsByTagName('td')];
      if (onMounted) {
        onMounted(items);
      }
      setAllItems(items);
    }

    return () => {
      setAllItems([]);
      setSelectedItems([]);
    };
  }, []);

  const addActiveClass = (target: any) => {
    target.classList.add(styles.selection_item_active);
  };

  const removeActiveClass = (target: any) => {
    target.classList.remove(styles.selection_item_active);
  };

  const onDown = (e: any) => {
    _.clearEventBubble(e);

    const { clientX, clientY } = e;

    const top = _.getTop(e.currentTarget);
    const left = _.getLeft(e.currentTarget);
    const { scrollTop, scrollLeft } = wrapperScroll || _.scroll();

    const startX = clientX - left + scrollLeft;
    const startY = clientY - top + scrollTop;

    setIsMouseDown(true);
    setStart({ startX, startY });
    setSelectEle({ ...selectEle, left: startX, top: startY });
  };

  const onMove = (e: any) => {
    _.clearEventBubble(e);
    const { startX, startY } = start;

    if (!isMouseDown) return;

    const top = _.getTop(e.currentTarget);
    const left = _.getLeft(e.currentTarget);
    const { scrollTop, scrollLeft } = wrapperScroll || _.scroll();

    const { clientX, clientY } = e;
    const _x = clientX - left + scrollLeft;
    const _y = clientY - top + scrollTop;

    const _left = _x > startX ? startX - 1 : _x + 1;
    const _top = _y > startY ? startY - 1 : _y + 1;
    const _width = Math.abs(_x - startX);
    const _height = Math.abs(_y - startY);
    const display = 'block';

    const items = [...e.currentTarget.getElementsByTagName('td')];
    selectedPostions.length = 0;
    selectedItems.length = 0;

    const newSelectItems: any[] = [];
    const newSelectedPostions: any[] = [];

    forEach(items, (item) => {
      removeActiveClass(item);

      if (_.isInPath(item, selectEle)) {
        addActiveClass(item);

        newSelectedPostions.push(item.dataset.position);
        newSelectItems.push(item);
      }
    });

    setSelectedPostions(newSelectedPostions);
    setSelectedItems(newSelectItems);
    setSelectEle({
      width: _width,
      height: _height,
      left: _left,
      top: _top,
      display,
    });
  };

  const onUp = (e: any) => {
    _.clearEventBubble(e);
    const target =
      e.target && e.target.tagName === 'TD'
        ? e.target
        : _.getParents(e.target, 'TD');

    forEach(allItems, (item: any) => {
      removeActiveClass(item);
    });

    onSelected(
      size(selectedPostions) < 2 ? [target.dataset.position] : selectedPostions,
    );

    setIsMouseDown(false);
    setSelectEle({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      display: 'none',
    });
    setSelectedPostions([]);
  };

  const onOver = (e: any) => {
    _.clearEventBubble(e);
    const target =
      e.target.tagName === 'TD' ? e.target : _.getParents(e.target, 'TD');

    addActiveClass(target);
    if (onHovered) {
      onHovered(target.dataset.position, target);
    }
  };
  const onLeave = (e: any) => {
    _.clearEventBubble(e);
    const target =
      e.target.tagName === 'TD' ? e.target : _.getParents(e.target, 'TD');

    if (!isMouseDown) {
      removeActiveClass(target);
    }
    if (onLeaved) {
      onLeaved(target.dataset.position, target);
    }
  };

  return (
    <div
      className={styles.selection_wrapper}
      style={{
        width: cols * width + margin * (1 + cols),
        height: rows * height + margin * (1 + rows),
      }}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
    >
      <div className={styles.selection_element} style={{ ...selectEle }} />
      <table
        className={styles.selection_content}
        cellSpacing="0"
        cellPadding="0"
        ref={selectionTable}
      >
        <thead>
          <tr>
            <th className={styles.thead_head}>日期/时间</th>
            {map(templates[0], (time) => {
              return (
                <th key={time} className={styles.thead_th}>
                  {time}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {map(templates, (template, row) => {
            return (
              <tr key={`row-${row}`}>
                <th scope="row" className={styles.tbody_th}>
                  {_.formatWeekDay(row + 1).week}
                </th>
                {map(template, (col) => {
                  const position = `${row}-${col}`;
                  const className = `${styles.selection_item} ${
                    includes(selected, position)
                      ? styles.selection_item_selected
                      : ''
                  }`;

                  return (
                    <td
                      onFocus={() => 0}
                      onMouseOver={onOver}
                      onMouseLeave={onLeave}
                      className={className}
                      style={{
                        width,
                        height,
                      }}
                      key={`col-${col}`}
                      data-position={position}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MomentBoxSelection;

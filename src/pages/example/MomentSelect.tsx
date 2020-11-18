/**
 * @Description: MomentSelect
 * @Author: zfh <zhangfuhao@mininglamp.com>
 * @Date: 2020-11-18 14:43:00
 * @LastEditor: zfh <zhangfuhao@mininglamp.com>
 * @LastEditTime: 2020-11-18 14:43:00
 */
import React, { FC, useState } from 'react';
import { xor } from 'lodash-es';

import MomentBoxSelection from '@/components/moment-box-selection';

const MomentSelect: FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const onSelected = (position: string[]) => {
    setSelected(xor(position, selected));
  };

  return (
    <>
      <h2>24小时 - 时刻选择</h2>

      <MomentBoxSelection selected={selected} onSelected={onSelected} />
    </>
  );
};

export default MomentSelect;

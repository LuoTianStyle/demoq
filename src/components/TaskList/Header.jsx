import React, { memo } from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.strong`
  font-size:14px;
  font-weight:400}.info-text span[data-v-b58c784a]:first-child{}
`;

const HeaderText = styled.span`
  font-size: 18px;
  color: #3c414b;
  padding-right: 10px;
`;

export default memo(() => (
  <HeaderWrapper>
    <HeaderText>
      任务列表
    </HeaderText>
  </HeaderWrapper>
));

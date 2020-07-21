import React, { memo } from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.strong`
  font-size: 14px;
  font-weight: 400;
`;

const HeaderText = styled.span`
  font-size: 18px;
  color: #3c414b;
  padding-right: 10px;
  transition:0.2s;
`;

export default memo(({ show }) => (
  <HeaderWrapper>
    <HeaderText style={!show ? { opacity: 0 } : { opacity: 1 }}>
      任务列表
    </HeaderText>
  </HeaderWrapper>
));

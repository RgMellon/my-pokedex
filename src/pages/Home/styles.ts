import styled, { css } from 'styled-components/native';

export const LoadingScreen = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.View`
  ${({ theme }) => css`
    background: ${theme.colors.background};
    padding: 20px;
    flex: 1;
  `}
`;

export const Header = styled.ImageBackground`
  ${({ theme }) => css`
    width: 100%;
    height: 200px;
    background: ${theme.colors.background};
  `}
`;

export const Title = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.text};
    font-size: 32px;
    line-height: 38px;
    font-weight: bold;
    margin-top: -70px;
  `}
`;

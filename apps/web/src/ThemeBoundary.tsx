import {useMondayContext} from '@/use-monday.ts';
import {ReactElement, useEffect} from 'react';
import {ConfigProvider, theme} from 'antd';
/**
 * this is a list of all the themes that monday supports, the value is the string we get from the monday context via postMessage
 */
enum MondayTheme {
    Dark = 'dark',
    Light = 'light',
    Hacker = 'hacker_theme',
    Black = 'black'
}

/**
 * this is a map of the context theme string (MondayTheme) to the class name we want to apply to the body. the class names are taken the official monday tokens
 */
const mondayThemeClassNameMap: Record<MondayTheme, string> = {
  [MondayTheme.Dark]: 'dark-app-theme',
  [MondayTheme.Light]: 'light-app-theme',
  [MondayTheme.Hacker]: 'hacker_theme-app-theme',
  [MondayTheme.Black]: 'black-app-theme',
};


/**
 * this hook applies the current monday theme to the body as a class name
 * @return {MondayTheme}
 */
function useMondayTheme() {
  const context = useMondayContext();
  const currentTheme = context.theme as MondayTheme;

  useEffect(function applyCurrentThemeAsBodyClass() {
    const bodyClassName = mondayThemeClassNameMap[currentTheme];
    if (!bodyClassName) {
      return;
    }
    document.body.classList.remove(...Object.values(mondayThemeClassNameMap));
    document.body.classList.add(bodyClassName);
  }, [currentTheme, context.theme]);

  return currentTheme;
}

/**
 * wraps the antd ConfigProvider and applies the current monday theme to it. naive implementation that just maps "darker" themes to the dark antd theme
 * should be extended if usage of antd gets extended
 * @param children
 * @constructor
 */
export function ThemeBoundary({children}: {children: ReactElement}) {
  const currentTheme = useMondayTheme();
  return <ConfigProvider
    theme={{
      /**
       * monday comes with 4 themes, but antd only comes with 2, so we need to map the monday theme to the antd theme
       * in the future we could build dedicated antd themes for the other 2 monday themes
       */
      algorithm: currentTheme === MondayTheme.Light ? theme.defaultAlgorithm : theme.darkAlgorithm,
    }}

  >{children}</ConfigProvider>;
}

declare module '*.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module 'stemn-frontend-shared/src/misc/Input/Input/Input'
declare module 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
declare module 'stemn-shared/misc/Layout'
declare module 'stemn-shared/misc/Panels/InfoPanel'
declare module 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
declare module 'stemn-shared/misc/Input/Input/Input'
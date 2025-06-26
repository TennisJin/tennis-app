declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "@dcloudio/uni-app" {
  import { App } from "vue";
  const createApp: (component: any) => App;
  export { createApp };
}

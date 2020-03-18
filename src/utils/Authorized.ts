import RenderAuthorize from '@/components/Authorized';
/* eslint-disable eslint-comments/disable-enable-pair */

// eslint-disable-next-line import/no-mutable-exports
let Authorized = RenderAuthorize(); // Reload the rights component

const reloadAuthorized = (authority:string[]) => {
  Authorized = RenderAuthorize(authority);
};

export { reloadAuthorized };
export default Authorized;
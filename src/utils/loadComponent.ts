// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function loadComponent<T>(scope, module): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await __webpack_init_sharing__('default');

    const container = window[scope];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const test = await container.init(__webpack_share_scopes__.default);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const factory = await window[scope].get(module);

    console.log({ container, factory, test });

    const Module = factory();

    return Module;
}

import {
  Injector,
  ComponentFactoryResolver,
  Injectable,
  ApplicationRef,
  ComponentRef,
  ReflectiveInjector,
  Type
} from '@angular/core';
import {Params} from './params';
import {ComponentLoader} from './component-loader';

export interface ModalRef {
  modal: any;
  destroy: Function;
}

/**
 * @object ModalFactory
 */
@Injectable()
export class ModalFactory {

  constructor(
    private _injector: Injector,
    private _resolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _componentLoader: ComponentLoader
  ) {
  }

  createModal(componentType: Type<any>, params: Object = {}): Promise<ModalRef> {
    return new Promise(resolve => {
      setImmediate(() => {
        const factory = this._resolver.resolveComponentFactory(componentType);
        const injector = ReflectiveInjector.resolveAndCreate([
          {provide: Params, useValue: new Params(params)}
        ], this._injector);
        const componentRef = factory.create(injector);
        const rootElement = componentRef.location.nativeElement;

        this._componentLoader.load(componentRef);

        const element = rootElement.children[0];
        const modalElement = element.tagName === 'ONS-MODAL' ? element : element.querySelector('ons-modal');

        if (!modalElement) {
          throw Error('<ons-modal> element is not found in component\'s template.');
        }

        resolve({modal: modalElement, destroy: () => componentRef.destroy()});
      });
    });
  }
}

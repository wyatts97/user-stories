import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import app from 'flarum/forum/app';

export default class PermissionDenied extends Component<ComponentAttrs> {
  oninit(vnode: Mithril.Vnode<ComponentAttrs, this>) {
    super.oninit(vnode);
  }

  view(vnode: Mithril.Vnode<ComponentAttrs, this>): Mithril.Children {
    return (
      <div className="permission-denied-container">
        <div className="permission-denied-content">{app.translator.trans('wyatts97-User-Stories.forum.youDontHavePermission')}</div>
      </div>
    );
  }
}

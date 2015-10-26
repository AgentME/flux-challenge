/* @flow */

import Kefir from 'kefir';

export default function wsObservable(url: string) {
  return Kefir.stream(emitter => {
    const ws = new WebSocket(url);
    ws.onerror = err => {
      emitter.error(err);
    };
    ws.onmessage = msg => {
      emitter.emit(msg);
    };
    return () => {
      ws.close();
    };
  });
}

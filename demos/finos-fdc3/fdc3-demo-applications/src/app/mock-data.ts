import {AppIntent, Context, Listener} from 'com-glue42-finos-fdc3-api-impl';
import {IInstrument} from './app';

const appIntent: AppIntent = {
  intent: {
    name: 'intentName',
    displayName: 'intentDisplayName'
  },
  apps: [{
    name: 'appName'
  }]
};

const listener: Listener = {
  unsubscribe: () => {}
};

export const fdc3Impl: any = {
  platforms: [{
    platformApi: {
      invoke: () =>
        Promise.resolve({result: { intentapps: [appIntent] } })
    }
  }],
  open: (name: string, context?: Context) => Promise.resolve(),
  findIntent: (intent: string, context?: Context) => Promise.resolve(appIntent),
  findIntentsByContext: (context: Context) => Promise.resolve([appIntent]),
  broadcast: () => {},
  raiseIntent: (intent: string, context: Context, target?: string) => Promise.resolve({
    source: 'source',
    version: 'source'
  }),
  addIntentListener: (intent: string, handler: (context: Context) => void) => listener,
  addContextListener: (handler: (context: Context) => void) => listener
};

export const instrument: IInstrument = {
  ric: 'ric',
  description: 'description'
};

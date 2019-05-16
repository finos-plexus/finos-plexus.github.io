import Fdc3Bus from "../fdc3Impl";
import { expect } from "chai";
import "mocha";

import { Method, MethodImplementation, MethodIntent } from "../interfaces/client-api";
import { AppIntent, Context, DesktopAgent } from "../interfaces/interface";

const interopPlatform: any = {
  config: {},
  type: "Test",
  connect: () => Promise.resolve({
    isConnected: true,
    discoverMethods: () => Promise.resolve([{
      name: testMethod.name,
      intent: methodIntent
    }]),
    invoke: (method: string | Method, args?: any) => Promise.resolve({
      method, arguments: args, result: 1
    }),
    onMethodRegistered: (callback: (method: Method) => void) => ({ unsubscribe: Promise.resolve() })
  })
};

const context: Context = {
  type: "test",
  name: "intent context"
};
const methodIntent: MethodIntent = {
  name: "testIntent",
  context: JSON.stringify(context)
};
const testMethod: MethodImplementation = {
  name: "testMethodName",
  onInvoke: (args: any) => Promise.resolve(args),
  intent: [methodIntent]
};

describe("FDC3 Implementation", () => {
  let fdc3Impl: DesktopAgent;

  before(async () => {
    fdc3Impl = await Fdc3Bus([interopPlatform], [testMethod]);
  });

  it("Should initialize", () => {
    expect(fdc3Impl.open).to.be.a("function");
  });

  describe("Find intent", () => {
    it("Should find intent by intent name", async () => {
      const appIntent: AppIntent = await fdc3Impl.findIntent(methodIntent.name);
      expect(appIntent.intent.name).to.equal(methodIntent.name);
    });

    it("Should find intent by intent name and context", async () => {
      const appIntent: AppIntent = await fdc3Impl.findIntent(methodIntent.name, context);
      expect(appIntent.intent.name).to.equal(methodIntent.name);
    });
  });

  describe("Find intents by context", () => {
    it("Should find intents by context", async () => {
      const appIntents: AppIntent[] = await fdc3Impl.findIntentsByContext(context);
      appIntents.forEach((appIntent: AppIntent) => {
        expect(appIntent.intent.name).to.equal(methodIntent.name);
      });
    });
  });
});

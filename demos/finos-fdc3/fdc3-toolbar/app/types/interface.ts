/**
 * Copyright © 2014-2019 Tick42 OOD
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export enum OpenError {
  AppNotFound = 'AppNotFound',
  ErrorOnLaunch = 'ErrorOnLaunch',
  AppTimeout = 'AppTimeout',
  ResolverUnavailable = 'ResolverUnavailable'
}

export enum ResolveError {
  NoAppsFound = 'NoAppsFound',
  ResolverUnavailable = 'ResolverUnavailable',
  ResolverTimeout = 'ResolverTimeout'
}

export enum SendError {
  SendOK = 'OK',
  UnknownPlatform = 'Invalid Platform',
  PlatformNotConnected = 'Platform Not connected',
  PlatformError = 'Platform Error'
}

export enum InteropApiImplementations {
  Glue42 = 'glue-interop-api-impl',
  Plexus = '@plexus-interop/common-api-impl',
}

/**
 * An fdc3Access instance provides an application with access to the FDC3 services provided by one
 * or more platforms.
 * Usage Note. For applications running on a Platform, the Platform may provide a preinitialized
 * fdc3Access instance. Applications may also instantiate their own instances which connect directly
 * to the Platforms.
 *
 * The current FDC3 services available via fdc3Access are:
 *   - Application management, which covers launching and activating applications. It is expected that the
 * applications available will have been read from one or more App Directory services but this is NOT a requirement.
 * NB Should we include the enumerate apps here or leave that to the AppD REST API (my vote).
 *   - Intents, listing Intents and firing them.
 *   - Contexts, broadcasting 'current context' to interested applications.
 *
 * The definitions of Applications, Intents and Contexts follow the proposals from the various FDC3 Working groups.
 * At some point in the future this interface can reference approved and (versioned) definitions from the WGs.
 * In this iteration, the appropriate definitions have been copied in here to enable this to be a self contained
 * proposal.
 *
 * Usage Note: Identity and Security are key issues to be addressed in a future iteration.
 */
export interface Fdc3APIImplementation {
  /**
   * Launches/links to an app by name.
   *
   * If a Context object is passed in, this object will be provided to the opened application via a contextListener.
   * The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.
   *
   * If opening errors, it returns an `Error` with a string from the `OpenError` enumeration.
   *
   *  ```javascript
   *     //no context
   *     agent.open('myApp');
   *     //with context
   *     agent.open('myApp', context);
   * ```
   */
  open(name: string, context?: Context): Promise<void>;

  /**
   * Find out more information about a particular intent by passing its name, and optionally its context.
   *
   * findIntent is effectively granting programmatic access to the Desktop Agent's resolver.
   * A promise resolving to the intent, its metadata and metadata about the apps that registered it is returned.
   * This can be used to raise the intent against a specific app.
   *
   * If the resolution fails, the promise will return an `Error` with a string from the `ResolveError` enumeration.
   *
   * ```javascript
   * // I know 'StartChat' exists as a concept, and want to know more about it ...
   * const appIntent = await agent.findIntent("StartChat");
   *
   * // returns a single AppIntent:
   * // {
   * //     intent: { name: "StartChat", displayName: "Chat" },
   * //     apps: [{ name: "Skype" }, { name: "Symphony" }, { name: "Slack" }]
   * // }
   *
   * // raise the intent against a particular app
   * await agent.raiseIntent(appIntent.intent.name, context, appIntent.apps[0].name);
   * ```
   */
  findIntent(intent: string, context?: Context): Promise<AppIntent>;

  /**
   * Find all the avalable intents for a particular context.
   *
   * findIntents is effectively granting programmatic access to the Desktop Agent's resolver.
   * A promise resolving to all the intents, their metadata and metadata about the apps that registered it is returned,
   * based on the context types the intents have registered.
   *
   * If the resolution fails, the promise will return an `Error` with a string from the `ResolveError` enumeration.
   *
   * ```javascript
   * // I have a context object, and I want to know what I can do with it, hence, I look for for intents...
   * const appIntents = await agent.findIntentsForContext(context);
   *
   * // returns for example:
   * // [{
   * //     intent: { name: "StartCall", displayName: "Call" },
   * //     apps: [{ name: "Skype" }]
   * // },
   * // {
   * //     intent: { name: "StartChat", displayName: "Chat" },
   * //     apps: [{ name: "Skype" }, { name: "Symphony" }, { name: "Slack" }]
   * // }];
   *
   * // select a particular intent to raise
   * const startChat = appIntents[1];
   *
   * // target a particular app
   * const selectedApp = startChat.apps[0];
   *
   * // raise the intent, passing the given context, targeting the app
   * await agent.raiseIntent(startChat.intent.name, context, selectedApp.name);
   * ```
   */
  findIntentsByContext(context: Context): Promise<AppIntent[]>;

  /**
   * Publishes context to other apps on the desktop.
   * ```javascript
   *  agent.broadcast(context);
   * ```
   */
  broadcast(context: Context): void;

  /**
   * Raises an intent to the desktop agent to resolve.
   * ```javascript
   * //raise an intent to start a chat with a given contact
   * const intentR = await agent.findIntents("StartChat", context);
   * //use the IntentResolution object to target the same chat app with a new context
   * agent.raiseIntent("StartChat", newContext, intentR.source);
   * ```
   */
  raiseIntent(intent: string, context: Context, target?: string): Promise<IntentResolution>;

  /**
   * Adds a listener for incoming Intents from the Agent.
   */
  addIntentListener(intent: string, handler: (context: Context) => void): Listener;

  /**
   * Adds a listener for incoming context broadcast from the Desktop Agent.
   */
  addContextListener(handler: (context: Context) => void): Listener;
}

/**
 * An interface that relates an intent to apps
 */
interface AppIntent {
  intent: IntentMetadata;
  apps: AppMetadata[];
}

/**
 * Intent descriptor
 */
interface IntentMetadata {
  name: string;
  displayName: string;
}

/**
 * App metadata is Desktop Agent specific - but should support a name property.
 */
interface AppMetadata {
  name: string;
}

/**
 * IntentResolution provides a standard format for data returned upon resolving an intent.
 * ```javascript
 * //resolve a "Chain" type intent
 * var intentR = await agent.raiseIntent("intentName", context);
 * //resolve a "Client-Service" type intent with data response
 * var intentR = await agent.raiseIntent("intentName", context);
 * var dataR = intentR.data;
 * ```
 */
interface IntentResolution {
  source: string;
  data?: object;
  version: string;
}

/**
 * An FDC3 Application.
 * UsageNote: Typically FDC3 applications are defined in an Application Directory and started via FDC3
 * However applications can also be started 'outside' FDC3 and announce themselves.
 */
export interface Application {
  appId: string;  // FDC App D unique id. or missing if empty or null then this is not an App Directory defined application
  name?: string;  // App name
  platformName: string;  // If the application runs on a Platform, the name of the Platform.
  appType?: string; // FDC3 AppD application type.
}

export interface Listener {
  /**
   * Unsubscribe the listener object.
   */
  unsubscribe(): Promise<void>;
}

/**
 * A context consists of one or more data items.
 * A data item e.g, an instrument or a client could be described using multiple formats.
 * TODO: Do all items need to be of the same type
 */
export interface Context {
  items: ContextItem[];
}

/**
 * A single context data item.
 * NB A data items may be presented using multiple formats.
 */
export interface ContextItem {
  itemFormat: ContextItemFormat[];  // The data items

  /**
   * Return a  comma separated list of all the formats used to define this data item.
   */
  getFormats(): string;
}

export interface ContextItemFormat {
  format: string; // The name of the format using FDC3 Context WG format == type.
  data: object;   // The item data in the given format.
}

/**
* Copyright © 2014-2018 Tick42 BG OOD, Deutsche Bank AG
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
(async () => {
    const applicationName = 'web-apps-launcher';
    window.platform = platformFactory();
    window.peer = await window.platform.connect(applicationName, undefined, []);
    appLogic.displayConnectedDetails(window.platform.type, window.peer.id);
    const discoveredApps = await window.platform.getPeerDefinitions();
    discoveredApps
        .filter(app => app.applicationName !== applicationName)
        .forEach(app => {
            const peerAppName = app.applicationName;
            const handler = () => {
                window.peer.invoke(`open-${peerAppName}`);
            };
            $('#apps-list').append(
                $('<li>').append(
                    $('<a>')
                    .bind('click', handler)
                    .attr('href','#').append(
                        $('<span>').append(peerAppName)
            )));
        });
})();

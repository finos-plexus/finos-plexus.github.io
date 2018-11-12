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

// The demo will run without any changes to this file.

// eslint-disable-next-line no-unused-vars
const appLogic = (() => {

    const connectionImageElement = $('#connection');
    const platformElement = $('#platform');

    const displayConnectedDetails = (platformType, peerId) => {
        // Display the connected image.
        connectionImageElement.attr('src', './assets/connected.png');
        // Display the platform type and peer id.
        platformElement.text(`Platform type: ${platformType}, peer id: ${peerId}`);
    };

    const displayDisconnectedDetails = () => {
        // Display the disconnected image.
        connectionImageElement.attr('src', './assets/disconnected.png');
        platformElement.text('Not connected');
    };

    return {
        displayConnectedDetails,
        displayDisconnectedDetails,
    };
})();

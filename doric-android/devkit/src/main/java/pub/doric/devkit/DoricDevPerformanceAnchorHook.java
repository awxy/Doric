/*
 * Copyright [2021] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package pub.doric.devkit;

import android.util.Log;

import pub.doric.performance.DoricPerformanceProfile;

/**
 * @Description: pub.doric.devkit
 * @Author: pengfei.zhou
 * @CreateDate: 2021/7/20
 */
public class DoricDevPerformanceAnchorHook implements DoricPerformanceProfile.GlobalAnchorHook {
    private static final String TAG = "DoricPerformance";

    @Override
    public void onAnchor(DoricPerformanceProfile profile, String name, long prepare, long start, long end) {
        Log.d(TAG, String.format("%s: %s prepared %dms, cost %dms.",
                profile.getName(), name, start - prepare, end - start));
    }

    @Override
    public void onAnchor(String name, long prepare, long start, long end) {
        //DO nothing
    }
}

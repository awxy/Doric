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
package pub.doric.engine;

import android.annotation.SuppressLint;
import android.content.Context;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSRuntimeException;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;


/**
 * @Description: This contains a webView which is used for executing JavaScript
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/3
 */
public class DoricWebViewJSExecutor implements IDoricJSE {
    private final WebView webView;

    public class WebViewCallback {
        @JavascriptInterface
        public void callNative(int command, String arguments) {

        }
    }

    @SuppressLint("JavascriptInterface")
    public DoricWebViewJSExecutor(Context context) {
        this.webView = new WebView(context.getApplicationContext());
        this.webView.loadUrl("about:blank");
        WebViewCallback webViewCallback = new WebViewCallback();
        this.webView.addJavascriptInterface(webViewCallback, "callNative");
    }

    @Override
    public String loadJS(String script, String source) {
        this.webView.evaluateJavascript(script, null);
        return script;
    }

    @Override
    public JSDecoder evaluateJS(String script, String source, boolean hashKey) throws JSRuntimeException {
        this.webView.evaluateJavascript(script, null);
        return null;
    }

    @Override
    public void injectGlobalJSFunction(String name, JavaFunction javaFunction) {

    }

    @Override
    public void injectGlobalJSObject(String name, JavaValue javaValue) {

    }

    @Override
    public JSDecoder invokeMethod(String objectName, String functionName, JavaValue[] javaValues, boolean hashKey) throws JSRuntimeException {
        return null;
    }

    @Override
    public void teardown() {
    }
}

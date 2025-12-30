D:\land\mobile>flutter build apk --release

Font asset "CupertinoIcons.ttf" was tree-shaken, reducing it from 257628 to 848 bytes (99.7% reduction). Tree-shaking can be disabled by providing the --no-tree-shake-icons flag when building your app.
Font asset "MaterialIcons-Regular.otf" was tree-shaken, reducing it from 1645184 to 3308 bytes (99.8% reduction). Tree-shaking can be disabled by providing the --no-tree-shake-icons flag when building your app.

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':path_provider_android:compileReleaseJavaWithJavac'.
> Could not resolve all files for configuration ':path_provider_android:androidJdkImage'.
   > Failed to transform core-for-system-modules.jar to match attributes {artifactType=_internal_android_jdk_image, org.gradle.libraryelements=jar, org.gradle.usage=java-runtime}.
      > Execution failed for JdkImageTransform: C:\Android\Sdk\platforms\android-34\core-for-system-modules.jar.
         > Error while executing process C:\Program Files\Android\Android Studio\jbr\bin\jlink.exe with arguments {--module-path C:\Users\hp pavilion\.gradle\caches\transforms-3\c0cf1973b65d12548dca194a780a7860\transformed\output\temp\jmod --add-modules java.base --output C:\Users\hp pavilion\.gradle\caches\transforms-3\c0cf1973b65d12548dca194a780a7860\transformed\output\jdkImage --disable-plugin system-modules}

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.

BUILD FAILED in 1m 28s
Running Gradle task 'assembleRelease'...                           89.9s
Gradle task assembleRelease failed with exit code 1

D:\land\mobile>, 
package hk.minmedia.leslie.thriveful;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.rnfs.RNFSPackage;
import com.yoloci.fileupload.FileUploadPackage;
import com.horcrux.svg.RNSvgPackage;
import android.content.Intent;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.magus.fblogin.FacebookLoginPackage;
import com.futurice.rctaudiotoolkit.AudioPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import org.pgsqlite.SQLitePluginPackage;
import com.react.rnspinkit.RNSpinkitPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {    
      
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNPermissionsPackage(),
            new KCKeepAwakePackage(),
            new BackgroundTimerPackage(),
            new RNFSPackage(),
            new FileUploadPackage(),
            new RNSvgPackage(),
            new AudioPackage(),
            new FacebookLoginPackage(),
            new PickerPackage(),
            new SQLitePluginPackage(),
            new RNSpinkitPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}

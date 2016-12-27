package hk.minmedia.leslie.thriveful;

import com.burnweb.rnpermissions.RNPermissionsPackage;  // <--- import
import com.facebook.react.ReactActivity;


import static android.Manifest.permission.ACCESS_COARSE_LOCATION;
import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static android.Manifest.permission.CALL_PHONE;
import static android.Manifest.permission.CAMERA;
import static android.Manifest.permission.READ_CONTACTS;
import static android.Manifest.permission.RECORD_AUDIO;
import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Thriveful";
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        RNPermissionsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults); // very important event callback
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
/*
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        PickerPackage.onRequestPermissionsResult(requestCode, permissions, grantResults); // very important event callback
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        /*
        switch (requestCode){
            case FINE_LOCATION_RESULT:
                if(hasPermission(ACCESS_FINE_LOCATION)){
                    //permissionSuccess.setVisibility(View.VISIBLE);
                }else{
                    permissionsRejected.add(ACCESS_FINE_LOCATION);
                    makePostRequestSnack();
                }
                break;
            case COARSE_LOCATION_RESULT:
                if(hasPermission(ACCESS_COARSE_LOCATION)){
                    //permissionSuccess.setVisibility(View.VISIBLE);
                }else{
                    permissionsRejected.add(ACCESS_COARSE_LOCATION);
                    makePostRequestSnack();
                }
                break;
            case CALL_PHONE_RESULT:
                if(hasPermission(CALL_PHONE)){
                    //permissionSuccess.setVisibility(View.VISIBLE);
                }else{
                    permissionsRejected.add(CALL_PHONE);
                    makePostRequestSnack();
                }
                break;
            case CAMERA_RESULT:
                if(hasPermission(CAMERA)){
                    //permissionSuccess.setVisibility(View.VISIBLE);
                }else{
                    permissionsRejected.add(CAMERA);
                    makePostRequestSnack();
                }
                break;
            case READ_CONTACTS_RESULT:
                if(hasPermission(READ_CONTACTS)){
                    //permissionSuccess.setVisibility(View.VISIBLE);
                }else{
                    permissionsRejected.add(READ_CONTACTS);
                    makePostRequestSnack();
                }
                break;
            case WRITE_EXTERNAL_RESULT:
                if(hasPermission(WRITE_EXTERNAL_STORAGE)){
                    //permissionSuccess.setVisibility(View.VISIBLE);
                }else{
                    permissionsRejected.add(WRITE_EXTERNAL_STORAGE);
                    makePostRequestSnack();
                }
                break;
            case RECORD_AUDIO_RESULT:
                if(hasPermission(RECORD_AUDIO)){
                    //permissionSuccess.setVisibility(View.VISIBLE);
                }else{
                    permissionsRejected.add(RECORD_AUDIO);
                    makePostRequestSnack();
                }
                break;
            case ALL_PERMISSIONS_RESULT:
                boolean someAccepted = false;
                boolean someRejected = false;
                for(String perms : permissionsToRequest){
                    if(hasPermission(perms)){
                        someAccepted = true;
                    }else{
                        someRejected = true;
                        permissionsRejected.add(perms);
                    }
                }

                if(permissionsRejected.size()>0){
                    someRejected = true;
                }

                if(someAccepted){
                    //permissionSuccess.setVisibility(View.VISIBLE);
                }
                if(someRejected){
                    makePostRequestSnack();
                }
                break;
        }

    }*/
}

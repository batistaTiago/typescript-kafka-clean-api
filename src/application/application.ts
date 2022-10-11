import * as Providers from '../infra/providers';

interface ApplicationBootOptions {

}

export class Application {
    private static booted = false;
    
    public static boot (options: ApplicationBootOptions = null) {
        if (Application.booted) {
            return;
        }

        console.log('######## booting app ########');
        Providers.registerAll();
        Application.booted = true;
    }
}
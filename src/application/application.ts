import * as Providers from '../infra/providers';

export class Application {
    private static booted = false;
    
    public static boot (options: object = null) {
        if (Application.booted) {
            return;
        }

        console.log('######## booting app ########');
        Providers.registerAll();
        Application.booted = true;
    }
}
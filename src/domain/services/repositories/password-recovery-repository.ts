import { PasswordRecoveryModel } from "../../dto/user/password-recovery-model";

export interface PasswordRecoveryRepository {
    storeRecovery(recovery: Omit<PasswordRecoveryModel, 'id'>): Promise<object>;
};

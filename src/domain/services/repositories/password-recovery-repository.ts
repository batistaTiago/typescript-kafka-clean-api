import { PasswordRecoveryModel } from "../../dto/user/password-recovery-model";
import { PasswordRecovery } from "../../entities/password-recovery";

export interface PasswordRecoveryRepository {
    storeRecovery(recovery: PasswordRecovery): Promise<PasswordRecoveryModel>;
    findRecovery(code: string, email: string): Promise<PasswordRecoveryModel>;
    markAsUsed(id: string): Promise<void>
};

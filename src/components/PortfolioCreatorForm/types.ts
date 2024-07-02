export const enum FormFields {
    ResumeFile = 'resume'
}

export interface Form {
    [FormFields.ResumeFile]: File | null;
}

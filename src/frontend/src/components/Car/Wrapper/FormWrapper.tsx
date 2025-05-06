
import { ReactNode } from "react"
import "./formWrapper.css"

type FormWrapperProps = {
    title: string,
    children: ReactNode,
}


export function FormWrapper(
    { title, children }: Readonly<FormWrapperProps>
) {
    return (
        <>
            <div className="form-dialog-header">
                <h2 className="form-dialog-content-title">
                    {title}
                </h2>
            </div>
            <div className="form-dialog-content-children">
                {children}
            </div>
        </>
    )
}
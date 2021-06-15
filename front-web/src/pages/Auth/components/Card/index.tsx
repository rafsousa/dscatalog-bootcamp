import React, { Children } from "react";
import './styles.scss';

type Props = {
    title: string;
    children: React.ReactNode;
}

const AuthCard = ({ title, children }: Props) => {
    return (
        <div className="card-base auth-card">
            <h1 className="aut-card-title">
                {title}
            </h1>
            {children}
        </div>
    )
}

export default AuthCard;
import React from 'react';
import LegalPageLayout from '../components/layout/LegalPageLayout';

const TermsPage = () => {
    return (
        <LegalPageLayout title="Terms of Service">
            <h2>1. Acceptance of Terms</h2>
            <p>
                By accessing and using CodeCrack ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                In addition, when using this Service's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h2>2. User Conduct and Responsibilities</h2>
            <p>
                You are responsible for all activity that occurs under your account. You agree not to use the Service for any purpose that is illegal or prohibited by these Terms.
            </p>
            <ul>
                <li>You agree not to post content that is harassing, defamatory, or obscene.</li>
                <li>You agree not to submit plagiarized solutions during contests or for problem submissions.</li>
                <li>You agree not to disrupt or interfere with the security of, or otherwise abuse, the Service.</li>
            </ul>

            <h2>3. Intellectual Property</h2>
            <p>
                The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of CodeCrack and its licensors.
                User-submitted solutions and discussion posts remain the intellectual property of the user, but you grant CodeCrack a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with the Service.
            </p>
            
            <h2>4. Termination</h2>
            <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
        </LegalPageLayout>
    );
};

export default TermsPage;
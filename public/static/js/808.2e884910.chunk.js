"use strict";(self.webpackChunkenvelope_frontend=self.webpackChunkenvelope_frontend||[]).push([[808],{2808:function(e,s,r){r.r(s),r.d(s,{default:function(){return R}});var a=r(1413),n=r(4165),t=r(5861),i=r(9439),l=r(2952),c="ResetAndResendEmail_sendEmailContainer__gTf5I",o="ResetAndResendEmail_sendEmailForm__BTDeU",m="ResetAndResendEmail_errorMessage__MbsUx",u="ResetAndResendEmail_formAction__3u-wH",d="ResetAndResendEmail_formActionBtn__BEF5y",p=r(9508),h=r(3168),v=r(3504),_=r(6871),f=r(7831),x=r(3719),E=r(1135),j=r(2791),w=r(3108),g=r(8170),N=r(184),R=function(){var e,s=(0,j.useContext)(w.V),r=(0,h.$)().t,R=(0,v.lr)(),b=(0,i.Z)(R,1)[0].get("requestType"),k=(0,p.x)(),y=k.isLoading,A=k.error,S=k.sendRequest,T=k.clearError,Z=(0,l.cI)({mode:"onChange"}),C=Z.register,q=Z.formState.errors,H=Z.handleSubmit,F=(0,_.s0)(),M=function(){var e=(0,t.Z)((0,n.Z)().mark((function e(r){var a,t,i,l,c;return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=(0,g.$)(null,s.csurfTk),T(),t=new AbortController,e.prev=3,i={user_email:r.user_email},l="activation"===b?"https://envelope-project.herokuapp.com/api/1.0/users/resend-activation-email":"https://envelope-project.herokuapp.com/api/1.0/users/password-reset",e.next=8,S(l,t,"POST",JSON.stringify(i),a);case 8:c="activation"===b?"/".concat(f.H.users,"/").concat(f.H.emailSent,"/?requestType=activation"):"/".concat(f.H.users,"/").concat(f.H.emailSent,"/?requestType=password"),F(c),e.next=14;break;case 12:e.prev=12,e.t0=e.catch(3);case 14:case"end":return e.stop()}}),e,null,[[3,12]])})));return function(s){return e.apply(this,arguments)}}();return y?(0,N.jsx)(x.Z,{}):(A&&(e=JSON.parse(A)),(0,N.jsxs)("div",{className:c,children:["activation"===b&&(0,N.jsx)("h1",{children:r("resendActivationEmail")}),"password"===b&&(0,N.jsx)("h1",{children:r("recoverPass")}),(0,N.jsxs)("form",{className:o,onSubmit:H(M),children:[(0,N.jsx)("label",{htmlFor:"user_email",children:"Email"}),(0,N.jsx)("input",(0,a.Z)({placeholder:"Email",type:"text"},C("user_email",{required:r("fieldNotEmpty"),pattern:{value:/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,message:r("validEmailField")}}))),q.user_email&&(0,N.jsx)("p",{className:m,children:q.user_email.message}),e&&e.user_email&&(0,N.jsx)("p",{className:m,children:e.user_email}),e&&e.invalidEmail&&(0,N.jsx)("p",{className:m,children:e.invalidEmail}),(0,N.jsx)("div",{className:u,children:(0,N.jsx)(E.Z,{className:d,type:"submit",children:r("send")})})]}),e&&e.serverMessage&&(0,N.jsx)("p",{className:m,children:e.serverMessage})]}))}}}]);
//# sourceMappingURL=808.2e884910.chunk.js.map
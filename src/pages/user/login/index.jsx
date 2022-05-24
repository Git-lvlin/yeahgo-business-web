import {
  LockOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Button, Modal } from 'antd';
import { history } from 'umi';
import * as api from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import styles from './index.less';
import md5 from 'js-md5';
import logo from '@/assets/logo.png'
import agreementText from './agreement';
import agreementTextTwo from './agreement-two';
import { initRongIM } from '../../../utils/IMUtils'
const Login = () => {
  const [randstr, setRandstr] = useState(Math.random());
  const [isVertyfy, setIsVertyfy] = useState(false);
  const [agreementVisible, setAgreementVisible] = useState(false);
  const [agreementVisible2, setAgreementVisible2] = useState(false);
  // const [account] = useState(JSON.parse(window.localStorage.getItem('account')) || {});
  const [captchaUrl, setCaptchaUrl] = useState()

  const checkIsVertyfy = () => {
    api.getErrorNums({}, { noAuth: true, showError: false }).then(res => {
      setIsVertyfy(res?.data?.records?.errorNum)
    })
  }

  const login = (payload) => {
    const { autoLogin, userName, password, verifyCode } = payload
    api.login({
      userName,
      password,
      verifyCode,
      randStr: `${randstr}`,
    }, { showError: true, noAuth: true }).then(res => {
      checkIsVertyfy()
      if (res && res.code === 0) {
        // if (autoLogin) {
        //   window.localStorage.setItem('account', JSON.stringify({ userName, password }))
        // } else {
        //   window.localStorage.removeItem('account');
        // }

        window.localStorage.setItem('token', res.data.records['admin-token'])
        window.localStorage.setItem('smsId', res.data.records['smsId'])
        window.localStorage.setItem('supplierType', res.data.records.supplierType)
        window.localStorage.setItem('nickName', res.data.records.nickName || res.data.records.accountName)
        window.localStorage.setItem('accountName', res.data.records.accountName)
        window.localStorage.setItem('user', JSON.stringify({ id: res.data.records.accountId, username: res.data.records.nickName || res.data.records.accountName }))
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('登录成功！');
        initRongIM()
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }

    })
  }

  const blur = (e) => {
    const { value } = e.target;
    if (value.trim()) {
      checkIsVertyfy()
    }
  }

  const upDateCaptchaImg = () => { setRandstr(Math.random()) }

  useEffect(() => {
    // if (account.name) {
    //   checkIsVertyfy(account.name)
    // }

    api.getCaptcha({ captchaCode: `${randstr}` }, { showError: true, noAuth: true })
      .then((res) => {
        const src = JSON.stringify(res.data.records.url)
        setCaptchaUrl(src.replace(/\"/g, ""))
      })
  }, [randstr])

  return (
    <div className={styles.main}>
      <div className={styles.title_wrap}>
        <div className={styles.logo}>
          <img src={logo} />
        </div>
        <div className={styles.title}>
          约购供应商家平台
          <div>全力以赴帮助广大商家营收</div>
        </div>
      </div>
      <ProForm
        // initialValues={{
        //   autoLogin: true,
        //   name: account.name,
        //   passwd: account.passwd,
        // }}
        submitter={{
          render: (props) => {
            return (
              <div className={styles.submit_wrap}>
                <ProFormCheckbox noStyle name="agreement">
                  已阅读并同意<a onClick={() => { setAgreementVisible(true) }}>《商家承诺书》</a><a onClick={() => { setAgreementVisible2(true) }}>《商家入驻服务协议》</a>
                </ProFormCheckbox>
                <Button size="large" style={{ marginBottom: 10, width: '100%', marginTop: 10 }} key="1" type="primary" onClick={() => props.form?.submit?.()}>
                  登录
                </Button>
                {/* <ProFormCheckbox noStyle name="autoLogin">
                  记住账号密码
                </ProFormCheckbox> */}
              </div>
            )
          },
        }}
        onFinish={(values) => {
          const { password, agreement } = values

          if (!agreement) {
            message.error('请先阅读并同意《供应商家服务协议》')
            return Promise.reject()
          }

          const md = md5(password)
          const val = {
            ...values,
            password: md
          }
          login(val);
          return Promise.resolve();
        }}
      >
        <ProFormText
          name="userName"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={styles.prefixIcon} />,
            onBlur: blur
          }}
          placeholder='请输入账号'
          rules={[
            {
              required: true,
              message: "请输入账号",
            },
          ]}
        />

        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={styles.prefixIcon} />,
            visibilityToggle: false,
            allowClear: true,
          }}
          placeholder='请输入密码'
          rules={[
            {
              required: true,
              message: '请输入密码'
            },
          ]}
        />

        {isVertyfy >= 3 && <div style={{ display: 'flex' }}>
          <ProFormText
            name="verifyCode"
            fieldProps={{
              size: 'large',
              prefix: <SafetyCertificateOutlined className={styles.prefixIcon} />,
            }}
            placeholder='请输入图形验证码'
            rules={[
              {
                required: true,
                message: "请输入图形验证码",
              },
            ]}
          />
          <img
            style={{ cursor: 'pointer', width: 80, height: 40, marginLeft: 10 }}
            src={captchaUrl}
            onClick={upDateCaptchaImg}
          />
        </div>}
      </ProForm>
      <Modal
        visible={agreementVisible}
        footer={null}
        onCancel={() => {
          setAgreementVisible(false)
        }}
        title={
          <div>商家承诺书 <span style={{ color: '#333', fontSize: 12 }}>请认真阅读如下内容</span></div>
        }
      >
        <pre
          style={{ width: '100%', height: 600, whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{
            __html: agreementText
          }}
        >

        </pre>
      </Modal>
      <Modal
        visible={agreementVisible2}
        footer={null}
        onCancel={() => {
          setAgreementVisible2(false)
        }}
        title={
          <div>商家入驻服务协议 <span style={{ color: '#333', fontSize: 12 }}>请认真阅读如下内容</span></div>
        }
      >
        <pre
          style={{ width: '100%', height: 600, whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{
            __html: agreementTextTwo
          }}
        >

        </pre>
      </Modal>
    </div>
  );
};

export default Login;

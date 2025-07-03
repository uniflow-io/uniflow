import React from 'react';
import { fetchConfig, updateConfig, useUser } from '../contexts/user';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth, useLogs } from '../contexts';
import { FC } from 'react';

export interface AdminProps {}

export interface AdminState {}

interface ConfigState {}

const Admin: FC<AdminProps> = () => {
  const [config, setConfig] = useState<ConfigState>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { auth, authDispatch } = useAuth();
  const { userDispatch } = useUser();
  const { logsDispatch } = useLogs();

  useEffect(() => {
    (async () => {
      if (auth.token && auth.uid) {
        const data = await fetchConfig(auth.token, auth.uid)(userDispatch, authDispatch);
        setConfig(Object.assign({}, config, data));
      }
    })();
  }, []);

  const onUpdate = async () => {
    setIsSaving(true);
    if (auth.token && auth.uid) {
      await updateConfig(config, auth.token, auth.uid)(userDispatch, authDispatch, logsDispatch);
    }
    setIsSaving(false);
  };

  return (
    <>
      <section className="section container-fluid">
        <h3 className="box-title">Admin</h3>
        <form className="form-sm-horizontal"></form>
      </section>
    </>
  );
};

export default Admin;

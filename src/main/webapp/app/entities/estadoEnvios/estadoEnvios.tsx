import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import TabPanel from './estadoEnvios-tabs';
import { Translate } from 'react-jhipster';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from '../sales/sales.reducer';

export interface IEnviosProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

// estilos material-ui
const useStyles = makeStyles({
  tabs: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    boxShadow: '5px 5px 5px 0px  rgba(0,0,0,0.29)',
  },
  tab: {
    '&:focus': {
      outline: 'none',
    },
  },
  tabLabel: {
    fontWeight: 900,
    color: '#004F87',
  },
  paper: { flexGrow: 1 },
});

// props de tabs
function tabProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const Envios = (props: IEnviosProps) => {
  // tab index
  const [tabActivo, changeTab] = useState(0);
  const [refresh, newRefresh] = useState(0);

  // estado para refresh de pantalla
  useEffect(() => {
    props.getEntities();
  }, [tabActivo, refresh]);

  // handle para cambio de Tab
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    changeTab(newValue);
  };

  const classes = useStyles();
  const { salesList, loading } = props;

  return (
    <div>
      <h2 id="envios-heading">
        <Translate contentKey="testApp.estadoEnvios.home.title">Estado de Envíos</Translate>
      </h2>
      {salesList && salesList.length > 0 ? (
        <Paper className={classes.paper}>
          <Tabs
            className={classes.tabs}
            value={tabActivo}
            onChange={handleTabChange}
            TabIndicatorProps={{ style: { background: '#004F87' } }}
            centered
          >
            <Tab label={<span className={classes.tabLabel}>ENCARGADOS</span>} {...tabProps(0)} className={classes.tab} />
            <Tab label={<span className={classes.tabLabel}>ENVIADOS</span>} {...tabProps(1)} className={classes.tab} />
            <Tab label={<span className={classes.tabLabel}>ENTREGADOS</span>} {...tabProps(2)} className={classes.tab} />
          </Tabs>
          <TabPanel value={tabActivo} filter={'IN_CHARGE'} index={0} salesList={salesList} newRefresh={newRefresh} refresh={refresh}>
            Encargados
          </TabPanel>
          <TabPanel value={tabActivo} filter={'SHIPPED'} index={1} salesList={salesList} newRefresh={newRefresh} refresh={refresh}>
            Enviados
          </TabPanel>
          <TabPanel value={tabActivo} filter={'DELIVERED'} index={2} salesList={salesList} newRefresh={newRefresh} refresh={refresh}>
            Entregados
          </TabPanel>
        </Paper>
      ) : (
        !loading && (
          <div className="alert alert-warning">
            <Translate contentKey="testApp.estadoEnvios.home.notFound">No se encontraron Envíos</Translate>
          </div>
        )
      )}
    </div>
  );
};

const mapStateToProps = ({ sales }: IRootState) => ({
  salesList: sales.entities,
  loading: sales.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Envios);

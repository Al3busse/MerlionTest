import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { updateStatusEntity } from './estadoEnvios.reducer';

// estilos de material-ui
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  bold: { fontWeight: 800 },
  tableRow: {
    '&:hover': {
      backgroundColor: 'silver !important',
    },
  },
  tableCell: { borderBottom: 'none', borderTop: '1px solid rgba(224, 224, 224, 1);' },
  noBorder: { borderBottom: 'none', borderTop: 'none' },
  sortButton: {
    '&:focus': {
      outline: 'none',
    },
    textTransform: 'none',
  },
  button: { backgroundColor: '#004f87', color: '#fff' },
});

// props de los paneles de tabs
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  filter: string;
  counter: number;
}

export default function TabPanel(props: TabPanelProps) {
  const { children, value, index, filter, counter, ...other } = props;

  // estado para refresh de pantalla
  const [counter2, newCounter2] = useState(0);

  // estado de data (sales)
  const [data, updateData] = useState([]);

  // importa data (sales) y lo aguarda en el estado
  useEffect(
    function effectFunction() {
      axios.get('api/sales').then(response => {
        updateData(response.data);
      });
    },
    [counter2, counter]
  );

  // funcion para sumar +1 a ambos contadores
  function counterUp() {
    newCounter2(counter2 + 1);
    counter + 1;
  }

  // handle de boton de enviar/entregar - cambia estado en BE y refreshea la pagina
  async function updateState(id: number) {
    await updateStatusEntity(id).then((resp: any) => (resp ? counterUp() : counterUp()));
  }

  const classes = useStyles();

  // filtra data por estado
  const dataFiltered = data.filter(i => i.state === filter);

  // estado del orden de nº de ventas
  const [order, changeOrder] = useState('des');

  // handle del orden de nº de ventas
  const handleSort = () => {
    order === 'des' ? changeOrder('asc') : changeOrder('des');
  };

  // funcion para ordenar
  const sortIDs = (a: number, b: number) => {
    if (order === 'des') {
      return a - b;
    } else {
      return b - a;
    }
  };

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead color="primary">
              <TableRow>
                <TableCell className={classes.noBorder}>
                  <Button onClick={handleSort} className={classes.bold + ' ' + classes.sortButton}>
                    <Translate contentKey="testApp.estadoEnvios.salesN">Nº de Venta</Translate>
                    <FontAwesomeIcon icon={order === 'asc' ? 'sort-up' : 'sort-down'} className="ml-1" />
                  </Button>
                </TableCell>
                <TableCell className={classes.bold}>
                  <Translate contentKey="testApp.estadoEnvios.state">Estado</Translate>
                </TableCell>
                <TableCell className={classes.bold}>
                  <Translate contentKey="testApp.estadoEnvios.product">Producto</Translate>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataFiltered.length > 0 ? (
                dataFiltered
                  .sort((a, b) => sortIDs(a.id, b.id))
                  .map((sales, i) => (
                    <TableRow key={`entity-${i}`} hover className={classes.tableRow}>
                      <TableCell className={classes.tableCell}>
                        <Button href={`sales/${sales.id}`} color="primary" className="ml-3">
                          {sales.id}
                        </Button>
                      </TableCell>
                      <TableCell className={'text-left' + ' ' + classes.tableCell}>
                        <Translate contentKey={`testApp.State.${sales.state}`} />
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {sales.product ? <Link to={`product/${sales.product.id}`}>{sales.product.name}</Link> : ''}
                      </TableCell>
                      {sales.state === 'IN_CHARGE' ? (
                        <TableCell className={'text-right' + ' ' + classes.tableCell}>
                          <div className="btn-group flex-btn-group-container">
                            <Button
                              className={classes.button}
                              onClick={() => {
                                updateState(sales.id);
                              }}
                              variant="contained"
                            >
                              <FontAwesomeIcon icon="truck" className="mr-1" />
                              <span className="d-none d-md-inline">
                                <Translate contentKey="testApp.estadoEnvios.send">Enviar</Translate>
                              </span>
                            </Button>
                          </div>
                        </TableCell>
                      ) : sales.state === 'SHIPPED' ? (
                        <TableCell className={'text-right' + ' ' + classes.tableCell}>
                          <div className="btn-group flex-btn-group-container">
                            <Button
                              className={classes.button}
                              onClick={() => {
                                updateState(sales.id);
                              }}
                              variant="contained"
                            >
                              <FontAwesomeIcon icon="clipboard-check" className="mr-1" />
                              <span className="d-none d-md-inline">
                                <Translate contentKey="testApp.estadoEnvios.delivered">Entregado</Translate>
                              </span>
                            </Button>
                          </div>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))
              ) : (
                <TableRow className="alert alert-warning">
                  <TableCell className={classes.tableCell}>
                    <Translate contentKey="testApp.estadoEnvios.tabResults">No se encontraron resultados.</Translate>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}
    </div>
  );
}

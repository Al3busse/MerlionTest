import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from '../product-bucket/product-bucket.reducer';
import { updateProductBucket } from './manejo-stock.reducer';
import { makeStyles } from '@material-ui/core/styles';

// estilos de material-ui
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableCellHead: {
    fontSize: '1.1rem',
    fontWeight: 800,
  },
  bold: { fontWeight: 800 },
  tableRow: {
    '&:hover': {
      backgroundColor: 'silver !important',
    },
  },
  buttonBox: { margin: '6px 0 6px 0' },
  tableCell: { borderBottom: 'none', borderTop: '1px solid rgba(224, 224, 224, 1);' },
  noBorder: { borderBottom: 'none', borderTop: 'none' },
  sortButton: {
    padding: '0px',
    '&:focus': {
      outline: 'none',
    },
    textTransform: 'none',
  },
  button: { backgroundColor: '#004f87', color: '#fff', margin: '1px' },
  noPadding: { padding: '0px' },
});

export interface IManejoStockProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const ManejoStock = (props: IManejoStockProps) => {
  // estado para refresh de pantalla
  const [counter, updateCounter] = useState(0);

  useEffect(() => {
    props.getEntities();
  }, [counter]);

  const { productBucketList, loading } = props;

  const productList = productBucketList.filter(i => i);

  const classes = useStyles();

  // estado del orden de los productos
  const [order, changeOrder] = useState('des');

  // handle del orden de los productos
  const handleSort = () => {
    order === 'des' ? changeOrder('asc') : changeOrder('des');
  };

  // funcion para ordenar
  const sortProducts = (a: string, b: string) => (order === 'asc' ? b.localeCompare(a) : a.localeCompare(b));

  // handle de los botones de buckets
  async function unitSwitch(id: number, change: string) {
    await updateProductBucket(id, change).then(() => updateCounter(counter + 1));
  }

  return (
    <div>
      <h2 id="product-bucket-heading">
        <Translate contentKey="testApp.manejoStock.home.title">Manejo de Stock</Translate>
      </h2>
      <div className="table-responsive">
        {productBucketList && productBucketList.length > 0 ? (
          <Table className={classes.table} aria-label="simple table">
            <TableHead color="primary">
              <TableRow>
                <TableCell variant="head">
                  <Button onClick={handleSort} className={classes.tableCellHead + ' ' + classes.sortButton}>
                    <Translate contentKey="testApp.manejoStock.product">Product</Translate>
                    <FontAwesomeIcon icon={order === 'asc' ? 'sort-alpha-up-alt' : 'sort-alpha-down'} className="ml-1" size="lg" />
                  </Button>
                </TableCell>
                <TableCell className={'text-center' + ' ' + classes.tableCellHead}>
                  <Translate contentKey="testApp.manejoStock.inChargeQuantity">In Charge Quantity</Translate>
                </TableCell>
                <TableCell padding="checkbox" />
                <TableCell className={'text-center' + ' ' + classes.tableCellHead} padding="none">
                  <Translate contentKey="testApp.manejoStock.availableToSellQuantity">Available Quantity</Translate>
                </TableCell>
                <TableCell padding="checkbox" />
                <TableCell className={'text-center' + ' ' + classes.tableCellHead}>
                  <Translate contentKey="testApp.manejoStock.brokenQuantity">Broken Quantity</Translate>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productList
                .sort((a, b) => sortProducts(a.product.name, b.product.name))
                .map((productBucket, i) => (
                  <TableRow key={`entity-${i}`} hover className={classes.tableRow}>
                    <TableCell className={'text-left' + ' ' + classes.tableCell}>
                      {productBucket.product ? (
                        <Link to={`product-bucket/${productBucket.id}/edit`}>{productBucket.product.name}</Link>
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell className={'text-center' + ' ' + classes.tableCell + ' ' + classes.bold}>
                      {productBucket.inChargeQuantity}
                    </TableCell>
                    <TableCell className={classes.noPadding}>
                      <Box display="flex" flexDirection="column" className={classes.buttonBox}>
                        <Button
                          onClick={() => {
                            unitSwitch(productBucket.id, 'InChargeToAvailable');
                          }}
                          className={classes.button}
                          variant="contained"
                          disabled={productBucket.inChargeQuantity < 1 ? true : false}
                        >
                          <FontAwesomeIcon icon="long-arrow-alt-right" className="mr-1" />
                        </Button>
                        <Button
                          onClick={() => {
                            unitSwitch(productBucket.id, 'AvailableToInCharge');
                          }}
                          className={classes.button}
                          variant="contained"
                          disabled={productBucket.availableToSellQuantity < 1 ? true : false}
                        >
                          <FontAwesomeIcon icon="long-arrow-alt-left" className="mr-1" />
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell className={'text-center' + ' ' + classes.tableCell + ' ' + classes.bold}>
                      {productBucket.availableToSellQuantity}
                    </TableCell>
                    <TableCell className={classes.noPadding}>
                      <Box display="flex" flexDirection="column" className={classes.buttonBox}>
                        <Button
                          onClick={() => {
                            unitSwitch(productBucket.id, 'AvailableToBroken');
                          }}
                          className={classes.button}
                          variant="contained"
                          disabled={productBucket.availableToSellQuantity < 1 ? true : false}
                        >
                          <FontAwesomeIcon icon="long-arrow-alt-right" className="mr-1" />
                        </Button>
                        <Button
                          onClick={() => {
                            unitSwitch(productBucket.id, 'BrokenToAvailable');
                          }}
                          className={classes.button}
                          variant="contained"
                          disabled={productBucket.brokenQuantity < 1 ? true : false}
                        >
                          <FontAwesomeIcon icon="long-arrow-alt-left" className="mr-1" />
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell className={'text-center' + ' ' + classes.tableCell + ' ' + classes.bold}>
                      {productBucket.brokenQuantity}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="testApp.manejoStock.home.notFound">No Products found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ productBucket }: IRootState) => ({
  productBucketList: productBucket.entities,
  loading: productBucket.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ManejoStock);

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from '../product-bucket/product-bucket.reducer';
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
  useEffect(() => {
    props.getEntities();
  }, []);

  const classes = useStyles();

  // estado del orden de los productos
  const [order, changeOrder] = useState('des');

  // handle del orden de los productos
  const handleSort = () => {
    order === 'des' ? changeOrder('asc') : changeOrder('des');
  };

  // funcion para ordenar
  const sortProducts = (a: string, b: string) => {
    if (order === 'asc') {
      {
        if (a > b) {
          return -1;
        }
        if (b > a) {
          return 1;
        }
        return 0;
      }
    }
  };

  const { productBucketList, match, loading } = props;

  const productList = productBucketList.filter(i => i);
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
                  <Translate contentKey="testApp.manejoStock.availableToSellQuantity">Available To Sell Quantity</Translate>
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
                      {productBucket.product ? <Link to={`product/${productBucket.product.id}`}>{productBucket.product.name}</Link> : ''}
                    </TableCell>
                    <TableCell className={'text-center' + ' ' + classes.tableCell + ' ' + classes.bold}>
                      {productBucket.inChargeQuantity}
                    </TableCell>
                    <TableCell className={classes.noPadding}>
                      <Box display="flex" flexDirection="column">
                        <Button className={classes.button} variant="contained">
                          <FontAwesomeIcon icon="long-arrow-alt-right" className="mr-1" />
                        </Button>
                        <Button className={classes.button} variant="contained">
                          <FontAwesomeIcon icon="long-arrow-alt-left" className="mr-1" />
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell className={'text-center' + ' ' + classes.tableCell + ' ' + classes.bold}>
                      {productBucket.availableToSellQuantity}
                    </TableCell>
                    <TableCell className={classes.noPadding}>
                      <Box display="flex" flexDirection="column">
                        <Button className={classes.button} variant="contained">
                          <FontAwesomeIcon icon="long-arrow-alt-right" className="mr-1" />
                        </Button>
                        <Button className={classes.button} variant="contained">
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

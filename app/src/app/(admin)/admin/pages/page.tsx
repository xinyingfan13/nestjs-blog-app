"use client";

// ** react
import React, { useState } from "react";

// ** next
import { default as NextLink } from "next/link";

// ** mui
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid/models";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

// ** third party
import { format } from "date-fns";

// ** services
import ArticleService from "@/services/ArticleService";

// ** models
import PageModel from "@/models/PageModel";
import ListQueryModel from "@/models/ListQueryModel";
import ListResponseModel from "@/models/ListResponseModel";

// ** hooks
import usePageQuery from "@/hooks/queries/usePageQuery";

// ** components
import DataGrid from "@/components/datagrid";
import SearchInput from "@/components/admin/shared/SearchInput";
import DataGridCacheClearColumn from "@/components/admin/shared/DatagridCacheClearColumn";

// ** config
import { PAGE_SIZE, QUERY_NAMES } from "@/config";

export default function AdminPageIndex() {
  const [params, setParams] = useState<ListQueryModel>({
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [customLoading, setCustomLoading] = useState(false);
  const { usePageItemsQuery } = usePageQuery();
  const { data, isLoading, isFetching } = usePageItemsQuery(params);
  const items = data?.data as ListResponseModel<PageModel[]>;
  const loading = isLoading || isFetching || customLoading;

  const columns: GridColDef[] = [
    {
      field: "cache",
      headerName: "Önbellek",
      sortable: false,
      disableColumnMenu: true,
      width: 80,
      renderCell: ({ row }: GridRenderCellParams<PageModel>) => (
        <DataGridCacheClearColumn path={row.guid} title={row.title} />
      ),
    },
    {
      field: "title",
      headerName: "Başlık",
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<any, PageModel, any>) => (
        <Link component={NextLink} href={`/admin/pages/${row._id}`}>
          {row.title}
        </Link>
      ),
    },
    {
      field: "publishingDate",
      headerName: "Tarih",
      width: 200,
      renderCell: ({ row }: GridRenderCellParams<PageModel>) =>
        format(new Date(row.publishingDate), "PP - p"),
    },
  ];

  return (
    <Box>
      <Grid
        container
        spacing={1}
        display="flex"
        justifyContent="space-between"
        pb={3}
      >
        <Grid item md={9} xs={12} display="flex" alignItems="center">
          <Stack direction="row" spacing={1}>
            <Typography variant="h5" fontWeight={500}>
              Sayfalar
            </Typography>
            <Button
              variant="contained"
              size="small"
              component={NextLink}
              href="/admin/pages/new"
            >
              Yeni ekle
            </Button>
          </Stack>
        </Grid>

        <Grid item md={3} xs={12}>
          <SearchInput
            loading={loading}
            params={params}
            setParams={setParams}
          />
        </Grid>
      </Grid>

      <DataGrid
        queryName={QUERY_NAMES.ARTICLE}
        loading={loading}
        setCustomLoading={setCustomLoading}
        deleteService={ArticleService.deleteItem}
        columns={columns}
        rows={items?.results || []}
        pageSize={params.pageSize as number}
        page={params.page as number}
        totalResults={items?.totalResults as number}
        params={params}
        setParams={setParams}
      />
    </Box>
  );
}

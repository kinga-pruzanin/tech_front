import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
  DataGrid,
  GridActionsCellItem,
  GridCellParams,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import MenuAppBar from '../app-bar/MenuAppBar';
import { BookDto } from '../api/dto/book.dto';
import { useApi } from '../api/ApiProvider';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        isbn: '',
        title: '',
        author: '',
        publisher: '',
        publishYear: '',
        availableCopies: 0,
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function AllBooks() {
  const apiClient = useApi();

  const [books, setBooks] = React.useState<BookDto[]>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  React.useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    apiClient.getAllBooks().then((response) => {
      if (response.success && response.data !== null) {
        const booksArray = Array.isArray(response.data)
          ? response.data
          : [response.data];
        const booksWithId = booksArray.map((book) => ({
          ...book,
          id: book.isbn,
        }));
        setBooks(booksWithId);
      }
    });
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (book: BookDto) => {
    if (book.isbn !== undefined) {
      const { isbn, title, author, publisher, publishYear, availableCopies } =
        book;

      apiClient
        .updateBook(isbn, {
          title,
          author,
          publisher,
          publishYear,
          availableCopies,
        })
        .then((response) => {
          if (response.success) {
            fetchBooks();
          } else {
            console.error('Failed to update book:', response.statusCode);
          }
        });
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = books.find((row) => row.id === id);
    if (editedRow && editedRow.isNew) {
      setBooks(books.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const {
      id,
      isbn,
      title,
      author,
      publisher,
      publishYear,
      availableCopies,
      deleted,
    } = newRow;
    const updatedRow: BookDto = {
      id,
      isbn,
      title,
      author,
      publisher,
      publishYear,
      availableCopies,
      deleted,
    };

    if ('isNew' in newRow) {
      updatedRow.isNew = false;
    }

    setBooks(books.map((book) => (book.id === newRow.id ? updatedRow : book)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleDeleteClick = (isbn: string) => {
    apiClient.deleteBook(isbn).then((response) => {
      if (response.success) {
        fetchBooks();
      } else {
        console.error('Failed to delete book:', response.statusCode);
      }
    });
  };

  const columnsWithActions: GridColDef[] = [
    {
      field: 'isbn',
      headerName: 'ISBN',
      type: 'string',
      width: 80,
      align: 'left',
      headerAlign: 'center',
      editable: false,
    },
    {
      field: 'title',
      headerName: 'Title',
      type: 'string',
      width: 80,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'author',
      headerName: 'Author',
      type: 'string',
      width: 80,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'publisher',
      headerName: 'Publisher',
      type: 'string',
      width: 80,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'publishYear',
      headerName: 'Publish year',
      type: 'string',
      width: 80,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'deleted',
      headerName: 'No longer available',
      type: 'string',
      width: 80,
      align: 'left',
      headerAlign: 'center',
      editable: false,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={() => handleSaveClick(params.row)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(params.id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditClick(params.id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(params.row.isbn)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div>
      <MenuAppBar title={'all books'} />

      <Paper sx={{ height: 500, width: '100%', marginBottom: '20px' }}>
        <DataGrid
          rows={books}
          columns={columnsWithActions}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar as GridSlots['toolbar'],
          }}
          slotProps={{
            toolbar: { setRows: setBooks, setRowModesModel },
          }}
        />
      </Paper>

      <div style={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="add"
          startIcon={<AddIcon />}
          sx={{ m: 1 }}
        >
          Add Book
        </Button>
      </div>
    </div>
  );
}

// import * as React from 'react';
// import Paper from '@mui/material/Paper';
// import {
//   DataGrid,
//   GridActionsCellItem,
//   GridCellParams,
//   GridColDef,
//   GridEventListener,
//   GridRowEditStopReasons,
//   GridRowId,
//   GridRowModel,
//   GridRowModes,
//   GridRowModesModel,
//   GridRowsProp,
//   GridSlots,
//   GridToolbarContainer,
// } from '@mui/x-data-grid';
// import {
//   randomCreatedDate,
//   randomTraderName,
//   randomId,
//   randomArrayItem,
// } from '@mui/x-data-grid-generator';
// import MenuAppBar from '../app-bar/MenuAppBar';
// import { BookDto } from '../api/dto/book.dto';
// import { useApi } from '../api/ApiProvider';
// import { Button, IconButton } from '@mui/material';
// import { Link } from 'react-router-dom';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Close';
//
// const columns: GridColDef[] = [
//   { field: 'isbn', headerName: 'ISBN', width: 170 },
//   { field: 'title', headerName: 'Title', width: 200 },
//   { field: 'author', headerName: 'Author', width: 170 },
//   { field: 'publisher', headerName: 'Publisher', width: 170 },
//   { field: 'publishYear', headerName: 'Publication year', width: 170 },
//   { field: 'availableCopies', headerName: 'Available copies', width: 170 },
// ];
//
// interface EditToolbarProps {
//   setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
//   setRowModesModel: (
//     newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
//   ) => void;
// }
//
// function EditToolbar(props: EditToolbarProps) {
//   const { setRows, setRowModesModel } = props;
//
//   const handleClick = () => {
//     const id = randomId();
//     setRows((oldRows) => [
//       ...oldRows,
//       {
//         id,
//         isbn: '',
//         title: '',
//         author: '',
//         publisher: '',
//         publishYear: '',
//         availableCopies: 0,
//         isNew: true,
//       },
//     ]);
//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' }, // Domyślnie ustaw pole do edycji na 'title'
//     }));
//   };
//
//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }
//
// export default function AllBooks() {
//   const apiClient = useApi();
//
//   const [books, setBooks] = React.useState<BookDto[]>([]);
//   const [selectedBook, setSelectedBook] = React.useState<BookDto | null>(null);
//   const [editRowIndex, setEditRowIndex] = React.useState<number | null>(null);
//   const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
//     {},
//   );
//
//   const handleRowEditStop: GridEventListener<'rowEditStop'> = (
//     params,
//     event,
//   ) => {
//     if (params.reason === GridRowEditStopReasons.rowFocusOut) {
//       event.defaultMuiPrevented = true;
//     }
//   };
//
//   React.useEffect(() => {
//     fetchBooks();
//   }, []);
//
//   const fetchBooks = () => {
//     apiClient.getAllBooks().then((response) => {
//       if (response.success && response.data !== null) {
//         const booksArray = Array.isArray(response.data)
//           ? response.data
//           : [response.data];
//         const booksWithId = booksArray.map((book) => ({
//           ...book,
//           id: book.isbn,
//         }));
//         setBooks(booksWithId);
//       }
//     });
//   };
//
//   const handleEditClick = (id: GridRowId) => () => {
//     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
//   };
//
//   const handleSaveClick = (book: BookDto) => {
//     if (book.isbn !== undefined) {
//       const { isbn, title, author, publisher, publishYear, availableCopies } =
//         book;
//
//       apiClient
//         .updateBook(isbn, {
//           title,
//           author,
//           publisher,
//           publishYear,
//           availableCopies,
//         })
//         .then((response) => {
//           if (response.success) {
//             fetchBooks();
//           } else {
//             console.error('Failed to update book:', response.statusCode);
//           }
//         });
//     }
//   };
//
//   const handleCancelClick = (id: GridRowId) => () => {
//     setRowModesModel({
//       ...rowModesModel,
//       [id]: { mode: GridRowModes.View, ignoreModifications: true },
//     });
//
//     const editedRow = books.find((row) => row.id === id);
//     if (editedRow && editedRow.isNew) {
//       setBooks(books.filter((row) => row.id !== id));
//     }
//   };
//
//   const processRowUpdate = (newRow: GridRowModel) => {
//     const {
//       id,
//       isbn,
//       title,
//       author,
//       publisher,
//       publishYear,
//       availableCopies,
//       deleted,
//     } = newRow;
//     const updatedRow: BookDto = {
//       id,
//       isbn,
//       title,
//       author,
//       publisher,
//       publishYear,
//       availableCopies,
//       deleted,
//     };
//
//     if ('isNew' in newRow) {
//       updatedRow.isNew = false;
//     }
//
//     setBooks(books.map((book) => (book.id === newRow.id ? updatedRow : book)));
//     return updatedRow;
//   };
//
//   const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
//     setRowModesModel(newRowModesModel);
//   };
//
//   const handleDeleteClick = (isbn: string) => {
//     apiClient.deleteBook(isbn).then((response) => {
//       if (response.success) {
//         fetchBooks();
//       } else {
//         console.error('Failed to delete book:', response.statusCode);
//       }
//     });
//   };
//
//   const columnsWithActions: GridColDef[] = [
//     {
//       field: 'isbn',
//       headerName: 'ISBN',
//       type: 'string',
//       width: 80,
//       align: 'left',
//       headerAlign: 'center',
//       editable: false,
//     },
//     {
//       field: 'title',
//       headerName: 'Title',
//       type: 'string',
//       width: 80,
//       align: 'left',
//       headerAlign: 'center',
//       editable: true,
//     },
//     {
//       field: 'author',
//       headerName: 'Author',
//       type: 'string',
//       width: 80,
//       align: 'left',
//       headerAlign: 'center',
//       editable: true,
//     },
//     {
//       field: 'publisher',
//       headerName: 'Publisher',
//       type: 'string',
//       width: 80,
//       align: 'left',
//       headerAlign: 'center',
//       editable: true,
//     },
//     {
//       field: 'publishYear',
//       headerName: 'Publish year',
//       type: 'string',
//       width: 80,
//       align: 'left',
//       headerAlign: 'center',
//       editable: true,
//     },
//     {
//       field: 'deleted',
//       headerName: 'No longer available',
//       type: 'string',
//       width: 80,
//       align: 'left',
//       headerAlign: 'center',
//       editable: false,
//     },
//     getActions: (params) => {
//     const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
//
//     if (isInEditMode) {
//       return [
//         <GridActionsCellItem
//             icon={<SaveIcon />}
//             label="Save"
//             sx={{
//               color: 'primary.main',
//             }}
//             onClick={() => handleSaveClick(params.row)}
//         />,
//         <GridActionsCellItem
//             icon={<CancelIcon />}
//             label="Cancel"
//             className="textPrimary"
//             onClick={handleCancelClick(params.id)}
//             color="inherit"
//         />,
//       ];
//     }
//
//     return [
//       <GridActionsCellItem
//           icon={<EditIcon />}
//           label="Edit"
//           className="textPrimary"
//           onClick={() => handleEditClick(params)}
//           color="inherit"
//       />,
//       <GridActionsCellItem
//           icon={<DeleteIcon />}
//           label="Delete"
//           onClick={() => handleDeleteClick(params.row.isbn)}
//           color="inherit"
//       />,
//     ];
//   },
// },
// ];
//
//   // const columnsWithActions: GridColDef[] = [
//   //   ...columns,
//   //   {
//   //     field: 'actions',
//   //     headerName: 'Actions',
//   //     width: 120,
//   //     renderCell: (params) => (
//   //       <>
//   //         <IconButton
//   //           aria-label="edit"
//   //           size="small"
//   //
//   //           //onClick={() => handleSaveClick(params.row as BookDto)}
//   //         >
//   //           <EditIcon />
//   //         </IconButton>
//   //         <IconButton
//   //           aria-label="delete"
//   //           size="small"
//   //           onClick={() => handleDeleteClick(params.row.id)}
//   //         >
//   //           <DeleteIcon />
//   //         </IconButton>
//   //       </>
//   //     ),
//   //   },
//   // ];
//
//   return (
//     <div>
//       <MenuAppBar title={'all books'} />
//
//       <Paper sx={{ height: 500, width: '100%', marginBottom: '20px' }}>
//         <DataGrid
//           rows={books}
//           columns={columnsWithActions}
//           editMode="row"
//           rowModesModel={rowModesModel}
//           onRowModesModelChange={handleRowModesModelChange}
//           onRowEditStop={handleRowEditStop}
//           processRowUpdate={processRowUpdate}
//           slots={{
//             toolbar: EditToolbar as GridSlots['toolbar'],
//           }}
//           slotProps={{
//             toolbar: { setBooks, setRowModesModel },
//           }}
//         />
//       </Paper>
//
//       <div style={{ textAlign: 'center' }}>
//         <Button
//           variant="contained"
//           color="primary"
//           component={Link}
//           to="add"
//           startIcon={<AddIcon />}
//           sx={{ m: 1 }}
//         >
//           Add Book
//         </Button>
//       </div>
//     </div>
//   );
// }

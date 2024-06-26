import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
  GridSlots,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import { useApi } from '../api/ApiProvider';
import { BookDto } from '../api/dto/book.dto';
import MenuAppBar from '../app-bar/MenuAppBar';
import backgroundImage from '../Klosterbibliothek_cStefan-Leitner-1920x1368.jpg';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

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
        publishYear: 0,
        availableCopies: 0,
        deleted: false,
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'id' },
    }));
  };

  return (
    <GridToolbarContainer
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput: string) =>
          searchInput
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value !== '')
        }
      />
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function AllBooks() {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );
  const apiClient = useApi();
  const [rows, setRows] = React.useState<BookDto[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
        setRows(booksWithId);
      }
    });
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = async (id: GridRowId) => {
    const book = rows.find((row) => row.id === id);

    if (!book) return;

    await processRowUpdate(book);

    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    const bookToDelete = rows.find((row) => row.id === id);

    if (!bookToDelete) return;

    try {
      const response = await apiClient.deleteBook(bookToDelete.isbn!);
      console.log('Delete book response:', response);

      if (response.success) {
        if (response.statusCode === 201) {
          const updatedRows = rows.map((row) =>
            row.id === id ? { ...row, deleted: true } : row,
          );
          setRows(updatedRows);
          console.log('Successfully marked book as deleted:', bookToDelete);
        } else {
          setRows(rows.filter((row) => row.id !== id));
          console.log('Successfully deleted book:', bookToDelete);
        }
      } else {
        console.log('Failed to delete book:', bookToDelete);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: BookDto) => {
    const updatedRow = { ...newRow, isNew: false };
    let response;

    console.log('Row before validation:', newRow);

    if (!newRow.isbn || !newRow.title || !newRow.author) {
      console.error('ISBN, title, and author are required fields.');
      return newRow;
    }

    const regex = /^\d{13}$/;
    if (!regex.test(newRow.isbn)) {
      handleClickOpen();
      console.error('ISBN must contain exactly 13 digits.');
      return newRow;
    }

    try {
      if (newRow.isNew) {
        console.log('Adding new book:', newRow);
        response = await apiClient.addBook({
          id: undefined,
          isbn: newRow.isbn,
          title: newRow.title,
          author: newRow.author,
          publisher: newRow.publisher,
          publishYear: newRow.publishYear,
          availableCopies: newRow.availableCopies,
          deleted: newRow.deleted || false,
        });

        console.log('Adding book response:', response);

        if (response.success) {
          updatedRow.id = Number(response.data?.id) || newRow.isbn;
          console.log('Successfully added book:', updatedRow);
        } else {
          console.log('Failed to add book:', response);
        }
      } else {
        const updatedBook: Partial<BookDto> = {
          id: newRow.id,
          isbn: newRow.isbn || '',
          title: newRow.title || '',
          author: newRow.author || '',
          publisher: newRow.publisher || '',
          publishYear: newRow.publishYear,
          availableCopies: newRow.availableCopies,
          deleted: newRow.deleted || false,
          isNew: newRow.isNew,
        };

        console.log('Updating book:', updatedBook);
        response = await apiClient.updateBook(newRow.isbn!, updatedBook);
        console.log('Update book response:', response);

        if (response.success) {
          console.log('Successfully updated book:', updatedRow);
        } else {
          console.log('Failed to update book:', response);
        }
      }

      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    } catch (error) {
      console.error('Error processing book:', error);
      return newRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: 'isbn',
      headerName: 'ISBN',
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'title',
      headerName: 'Title',
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'author',
      headerName: 'Author',
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'publisher',
      headerName: 'Publisher',
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'publishYear',
      headerName: 'Publish year',
      type: 'number',
      width: 180,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'availableCopies',
      headerName: 'Available copies',
      type: 'number',
      width: 180,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'deleted',
      headerName: 'No longer available',
      type: 'string',
      width: 180,
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
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={(e: any) => handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div>
      <MenuAppBar title={'All books'} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Failed to add a book'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The new ISBN number must contain 13 digits. If you were assigned
            10-digit ISBNs or else, you can convert them to the 13-digit format
            at the converter found on the ISBN website.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '20px',
        }}
      >
        <Box
          sx={{
            height: '85vh',
            width: '100%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar as GridSlots['toolbar'],
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            sx={{ backgroundColor: '#fff' }}
          />
        </Box>
      </Box>
    </div>
  );
}

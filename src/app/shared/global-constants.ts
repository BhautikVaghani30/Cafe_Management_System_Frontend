export class GlobalConstants {
  // message
  public static genericError: string =
    'Something went wrong. Please try again.';
  public static unauthorized: string = 'You do not have access to this page.';
  public static productExists: string = 'This product already exists.';
  public static productAdded: string = 'Product added successfully.';
  public static order: string = 'order added successfully.';

  // regex
  public static nameRegex: string = '[a-zA-Z ]*';
  public static emailegex: string =
    '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
  public static passwordregex: string =
    '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';
  public static contactNumberRegex: string = '^[e0-9]{10,10}$';

  // error
  public static error: string = 'error';
}

import { Factory } from '../core/Factory/Factory.js';

interface LogConfiguration {
    primaryText ?: string;
    primaryTextFlag ?: boolean;
    primaryTextFormatSymbol ?: string;
    secondaryText ?: string;
    secondaryTextFlag ?: boolean;
    secondaryTextFormatSymbol ?: string;
    verbosity ?: string;
    dateTimeLocale ?: string;
    ascii ?: { [asciiFormatSymbol : string] : string; }
    asciiFormatSymbol ?: string;
    asciiFlag ?: boolean;
    formattingFlag ?: boolean;
    dateTimeFlag ?: boolean;
    instanceIdFlag ?: boolean;
    asciiColourHex ?: string;
    metaColourHex ?: string;
    traceColourHex ?: string;
    infoColourHex ?: string;
    warnColourHex ?: string;
    errorColourHex ?: string;
    fatalColourHex ?: string;
}

/**
 * @class Log
 * @version 2.2.5
 * @description The Log class provides a means for outputting information to the console.
 * 
 * @todo Export all logs to an output directory.
 *      Trace logs should go to one file.
 *      >= info logs to another.
 *      >= error logs to another.
 * @todo Provide a format or template for _createLogString. 
 * @todo Need to research and implement standard colours.
 * @todo ASCII / logo when Log class is initialised.
 */
 export class Log extends Factory {
    private static _instanceCount = 0;
    private _instanceId = 0;

    private _configuration = {
        'primaryText': 'primary',
        'primaryTextFlag': true,
        'primaryTextFormatSymbol': 'FG_TEMP',
        'secondaryText': 'secondary',
        'secondaryTextFlag': true,
        'secondaryTextFormatSymbol': 'FG_TEMP',
        'verbosity': 'INFO',
        'dateTimeLocale': 'en-GB',
        'ascii': { } as { [asciiSymbol : string] : string; },
        'asciiFlag': true,
        'asciiFormatSymbol': 'FG_GREY',
        'formattingFlag': true,
        'dateTimeFlag': true,
        'instanceIdFlag': true,
        'asciiColourHex': '#D3D7CF',
        'metaColourHex': '#5D626B',
        'traceColourHex': '#5D626B',
        'infoColourHex': '#D3D7CF',
        'warnColourHex': '#FA983A',
        'errorColourHex': '#C23616',
        'fatalColourHex': '#C23616',
    } 

    /**
     * @memberof Log
     * @description Available ascii characters and their symbols.
     *      Configured via the "ascii" object property.
     * @static
     * @readonly
     * @property {string} [WRAP_LEFT = "["] General left character for text grouping.
     * @property {string} [WRAP_RIGHT = "]"] General right character for text grouping.
     * @property {string} [CONTEXT_LEFT = "("]  Left character for context text.
     * @property {string} [CONTEXT_RIGHT = ")"] Right character for context text.
     */
    public static readonly ASCII_LOOKUP : { [asciiSymbol : string] : string; } = {
        'WRAP_LEFT': '[',
        'WRAP_RIGHT': ']',
        'CONTEXT_LEFT': '(',
        'CONTEXT_RIGHT': ')',
    };

    /**
     * @memberof Log
     * @description Available verbosity level symbols. Configured via the "verbosity" property.
     * @static
     * @readonly
     * @property {string} TRACE Display all messages.
     * @property {string} INFO Display info, warn, error and fatal messages.
     * @property {string} WARN Display warn, error and fatal messages.
     * @property {string} ERROR Display error and fatal messages.
     * @property {string} FATAL Display only fatal messages.
     */
    public static readonly VERBOSITY_LOOKUP = ['TRACE', 'INFO', 'WARN', 'ERROR', 'FATAL'];

    /**
     * @memberof Log
     * @description Available formatting symbols.
     * @static
     * @readonly
     * @property {string} RESET Reset.
     * @property {string} FG_GREY Foreground grey.
     * @property {string} FG_WHITE Foreground white.
     * @property {string} FG_ORANGE Foreground orange.
     * @property {string} FG_RED Foreground red.
     * @property {string} FG_BLUE Foreground blue.
     * @property {string} FG_BLACK Foreground black.
     * @property {string} FG_GREEN Foreground green.
     * @property {string} BG_RED Background red.
     */
    public static readonly ESCAPE_CODE_LOOKUP : { [escapeCodeFormatSymbol : string] : string; } = {
        'RESET': '\x1b[0m',
        'FG_GREY': '\x1b[38;2;65;80;96m',
        'FG_WHITE': '\x1b[38;2;211;215;207m',
        'FG_ORANGE': '\x1b[38;2;250;152;58m',
        'FG_RED': '\x1b[38;2;194;54;22m',
        // 'FG_BLUE': '\x1b[38;2;27m',
        // 'FG_BLACK': '\x1b[38;2;0m',
        'FG_GREEN': '\x1b[38;2;68;189;50m',
        'BG_RED': '\x1b[48;2;194;54;22m',
        'FG_TEMP': '\x1b[38;2;26;188;156m',
    };
    /**
     * @constructs Log
     * @description The Log constructor used to set instance settings.
     *      Sets the scope name + colour, application name + colour, formatting flag and minimum verbosity.
     * @param {LogConfiguration} configuration The main configuration object.
     * @param {string} [configuration.primaryText = primary] The primary text or title, to be prefixed to all messages.
     * @param {string} [configuration.primaryTextFormatSymbol = FG_BLUE] The ESCAPE_CODE_LOOKUP symbol for the primary text.
     * @param {string} [configuration.secondaryText = secondary] The secondary text or title, to be prefixed to all messages.
     * @param {string} [configuration.secondaryTextFormatSymbol = FG_BLUE] The ESCAPE_CODE_LOOKUP symbol for the secondary text.
     * @param {string} [configuration.verbosity = TRACE] The minimum VERBOSITY_LOOKUP symbol for the message output.
     * @param {string} [configuration.dateTimeLocale = en_GB] The date and time locale identifier.
     * @param {object} [configuration.ascii = ASCII_LOOKUP] An object of ASCII_LOOKUP symbols.
     * @param {string} [configuration.asciiFormatSymbol = FG_WHITE] The ESCAPE_CODE_LOOKUP symbol for all ascii characters.
     * @param {boolean} [configuration.formattingFlag = true] Flag to determine whether to use escape codes.
     * @param {boolean} [configuration.dateTimeFlag = true] Flag to determine whether to include the date.
     * @param {boolean} [configuration.asciiFlag = true] Flag to determine whether to include ascii characters.
     * @param {boolean} [configuration.instanceIdFlag = true] Flag to determine whether to include the instance id.
     * @param {boolean} [configuration.primaryTextFlag = true] Flag to determine whether to include the primary text.
     * @param {boolean} [configuration.secondaryTextFlag = true] Flag to determine whether to include the secondary text.
     */
    public constructor(id : string, configuration : LogConfiguration) {
        super(id);

        Log._instanceCount += 1;
        this._instanceId = Log._instanceCount;

        Object.assign(this._configuration, configuration);

        this._configuration.ascii = Object.assign({ }, Log.ASCII_LOOKUP);
        Object.assign(this._configuration.ascii, configuration.ascii);

    }

    private _outputGuard = (verbosity : string) : boolean => (
        Log.VERBOSITY_LOOKUP.indexOf(this._configuration.verbosity)
        <= Log.VERBOSITY_LOOKUP.indexOf(verbosity)
    );

    /**
     * @method Log#trace
     * @description The 'trace' logging method. Used for basic networking and debug related
     *      messages. Outputs in grey. A successful message that resolves to true.
     * @param {string} message The message to be logged.
     * @param {string} [context] The optional context to be prefixed to the message.
     * @returns {boolean} True. Allows the method itself to be returned.
     */
     public trace(message : string, context ?: string) : boolean {
        if (this._outputGuard('TRACE')) Log._processMessage(message, line => 
            process.stdout.write(this._createLogString(
                line,
                this._getEscapeCode('FG_GREY'),
                context
            ))
        );

        return true;
    }

    /**
     * @method Log#info
     * @description The 'info' logging method. Basic information. Outputs in white.
     *      A successful message that resolves to true.
     * @param {string} message The message to be logged.
     * @param {string} [context] The optional context to be prefixed to the message.
     * @returns {boolean} True. Allows the method itself to be returned.
     */
    public info(message : string, context ?: string) : boolean {
        if (this._outputGuard('INFO')) Log._processMessage(message, line => 
            process.stdout.write(this._createLogString(
                line,
                this._getEscapeCode('FG_WHITE'),
                context
            ))
        );

        return true;
    }

    /**
     * @method Log#warn
     * @description The 'warn' logging method. Warns the user that there may be an issue.
     *      Outputs in orange. A successful message that resolves to true.
     * @param {string} message The message to be logged.
     * @param {string} [context] The optional context to be prefixed to the message.
     * @returns {boolean} True. Allows the method itself to be returned.
     */
    public warn(message : string, context ?: string) : boolean {
        if (this._outputGuard('WARN')) Log._processMessage(message, (line) => 
            process.stdout.write(this._createLogString(
                line,
                this._getEscapeCode('FG_ORANGE'),
                context
            ))
        );

        return true;
    }

    /**
     * @method Log#error
     * @description The 'error' logging method. Lets the user know an error has occured.
     *      Outputs in red. An unsuccessful message that resolves to false.
     * @param {string} message The message to be logged.
     * @param {string} [context] The optional context to be prefixed to the message.
     * @returns {string} False. Allows the method itself to be returned.
     */
    public error(message : string, context ?: string) : boolean {
        if (this._outputGuard('ERROR')) Log._processMessage(message, (line) => 
            process.stdout.write(this._createLogString(
                line,
                this._getEscapeCode('FG_RED'),
                context
            ))
        );

        return false;
    }

    /**
     * @method Log#fatal
     * @description The 'fatal' logging method. Highest form of error, stops the application.
     *      Outputs in red and black. An unsuccessful message that ends the application.
     * @param {string} message The message to be logged.
     * @param {string} [context] The optional context to be prefixed to the message.
     * @returns {never} Does not return. Ends the application.
     */
    public fatal(message : string, context ?: string) : never {
        if (this._outputGuard('FATAL')) Log._processMessage(message, (line) => 
            process.stdout.write(this._createLogString(
                line,
                `${this._getEscapeCode('BG_RED')}${this._getEscapeCode('FG_BLACK')}`,
                context
            ))
        );

        process.exit(1);
    }

    /**
     * @method Log#httpRequest
     * @description The 'httpRequest' logging method. States the HTTP request information.
     *      Uses the trace method. A successful message that resolves to true.
     * @param {express.Request} request The incoming express request object.
     * @returns {boolean} True. Allows the method itself to be returned.
     */
    public httpRequest(request : any) : boolean {
        return this.trace(
            `(${request.method}) `
            + `${request.connection.remoteAddress} -> `
            + `${request.protocol}://${request.get('host')}${request.originalUrl}`,
            'http'
        );
    }

    /**
     * @method Log#database
     * @description The 'database' logging method. States the information processed
     *      by the database. Uses the trace method. A successful message that resolves to true.
     * @param {string} url The database URL.
     * @param {string} dataId An identifier for the data being processed.
     * @param {string} method The processing method.
     * @returns {boolean} True. Allows the method itself to be returned.
     */
    public database(url : string, dataId : string, method : string) : boolean {
        return this.trace(
            `${method} ${dataId} -> ${url}`,
            'database'
        );
    }

    /**
     * @method Log#email
     * @description The 'email' logging method. States an email being sent to an address.
     *      Uses the trace method. A successful message that resolves to true.
     * @param {string} url The database URL.
     * @param {string} dataId An identifier for the data being processed.
     * @param {string} method The processing method.
     * @returns {boolean} True. Allows the method itself to be returned.
     */
    public email(emailId : string, recipient : string) : boolean {
        return this.trace(
            `${emailId} -> ${recipient}`,
            'email'
        );
    }

    private static _processMessage = (
        message : string,
        callback : (line : string, index ?: number) => void
    ) : void => message.split('\n').forEach(callback);

    /**
     * @method Log#_getEscapeCode
     * @description Looks up an escape code by a provided format symbol.
     *      Checks the formattingFlag to toggle the presence of escape sequences in log messages.
     * @private
     * @param {string} escapeCodeFormatSymbol The string format symbol for the escape code lookup table.
     * @returns {string} The escape code.
     * @returns {string} An empty string.
     */
    private _getEscapeCode = (escapeCodeFormatSymbol : string) : string => 
        (this._configuration.formattingFlag)
            ? Log.ESCAPE_CODE_LOOKUP[escapeCodeFormatSymbol]
            : '';

    /**
     * @method Log#_createAsciiString
     * @description Crafts an ascii character string containing escape sequence formatting.
     *      Checks the asciiFlag to toggle the presence of ascii characters in the output.
     * @private
     * @param {string} asciiSymbol The string ascii symbol.
     * @returns {string} The ascii string.
     * @returns {string} An empty string.
     */
    private _createAsciiString = (asciiSymbol : string) : string =>
        (this._configuration.asciiFlag)
            ? `${this._getEscapeCode(this._configuration.asciiFormatSymbol)}`
                + `${this._configuration.ascii[asciiSymbol]}`
                + `${this._getEscapeCode('RESET')}`
            : '';

    /**
     * @method Log#_createDateTimeString
     * @description Crafts a date and time string containing escape sequence formatting and ascii.
     *      Checks the dateTimeFlag to toggle the presence of the date and time in the output.
     * @private
     * @returns {string} The date and time string.
     * @returns {string} An empty string.
     */
    private _createDateTimeString = () : string => (this._configuration.dateTimeFlag)
        ? `${this._createAsciiString('WRAP_LEFT')}`
            + `${this._getEscapeCode('FG_GREY')}`
            + `${new Date().toLocaleString(this._configuration.dateTimeLocale).replace(', ', '-')}`
            + `${this._getEscapeCode('RESET')}`
            + `${this._createAsciiString('WRAP_RIGHT')} `
        : '';

    /**
     * @method Log#_createInstanceIdString
     * @description Crafts an instance id string containing escape sequence formatting and ascii.
     *      Checks the instanceIdFlag to toggle the presence of the instance id in the output.
     * @private
     * @returns {string} The instance id string.
     * @returns {string} An empty string.
     */
    private _createInstanceIdString = () : string => (this._configuration.instanceIdFlag)
        ? `${this._createAsciiString('WRAP_LEFT')}`
            + `${this._getEscapeCode('FG_GREY')}`
            + `#${this._instanceId}`
            + `${this._getEscapeCode('RESET')}`
            + `${this._createAsciiString('WRAP_RIGHT')} `
        : '';

    /**
     * @method Log#_createPrimaryTextString
     * @description Crafts the primary text string containing escape sequence formatting and ascii.
     *      Checks the primaryTextFlag to toggle the presence of the primary text in the output.
     * @private
     * @returns {string} The primary text string.
     * @returns {string} An empty string.
     */
    private _createPrimaryTextString = () : string => (this._configuration.primaryTextFlag)
        ? `${this._createAsciiString('WRAP_LEFT')}`
            + `${this._getEscapeCode(this._configuration.primaryTextFormatSymbol)}`
            + `${this._configuration.primaryText}`
            + `${this._getEscapeCode('RESET')}`
            + `${this._createAsciiString('WRAP_RIGHT')} `
        : '';

    /**
     * @method Log#_createSecondaryTextString
     * @description Crafts the secondary text string containing escape sequence formatting and ascii.
     *      Checks the secondaryTextFlag to toggle the presence of the secondary text in the output.
     * @private
     * @returns {string} The secondary text string.
     * @returns {string} An empty string.
     */
    private _createSecondaryTextString = () : string => (this._configuration.secondaryTextFlag)
        ? `${this._createAsciiString('WRAP_LEFT')}`
            + `${this._getEscapeCode(this._configuration.secondaryTextFormatSymbol)}`
            + `${this._configuration.secondaryText}`
            + `${this._getEscapeCode('RESET')}`
            + `${this._createAsciiString('WRAP_RIGHT')} `
        : '';

    /**
     * @method Log#_createContextString
     * @description Crafts the optional context string containing escape sequence
     *      formatting and ascii.
     * @private
     * @param {string} [context] The optional context to be prefixed to the message.
     * @returns {string} The context string.
     * @returns {string} An empty string.
     */
    private _createContextString = (context ?: string) : string => (context)
        ? `${this._createAsciiString('CONTEXT_LEFT')}`
            + `${this._getEscapeCode('FG_WHITE')}`
            + `${context}`
            + `${this._getEscapeCode('RESET')}`
            + `${this._createAsciiString('CONTEXT_RIGHT')} `
        : '';

    /**
     * @method Log#_createMessageString
     * @description Crafts the message string containing escape sequence
     *      formatting and ascii.
     * @private
     * @param {string} message The message to be logged.
     * @param {string} messageFormatCode The formatting code escape sequence.
     * @returns {string} The message string.
     */
    private _createMessageString = (message : string, formatCode : string) : string =>
        `${formatCode}${message}${this._getEscapeCode('RESET')}`

    /**
     * @method Log#_createLogString
     * @description The main logging string crafting function.
     * @private
     * @param {string} message The message to be logged.
     * @param {string} messageFormatCode The formatting code escape sequence.
     * @param {string} [context] The optional context to be prefixed to the message.
     * @returns {string} The crafted message. [<DATE>] [#<INSTANCE_ID>] [<SCOPE_NAME>] [<APPLICATION_NAME>] (<CONTEXT>) <MESSAGE>
     */
    private _createLogString = (
        message : string,
        messageFormatCode : string,
        context ?: string
    ) : string =>
        `${this._createDateTimeString()}`                                       // Date
            + `${this._createInstanceIdString()}`                               // Instance ID
            + `${this._createPrimaryTextString()}`                              // Scope Name
            + `${this._createSecondaryTextString()}`                            // Application Name
            + `${this._createContextString(context)}`                           // Context
            + `${this._createMessageString(message, messageFormatCode)}\n`;     // Message

}

/**
 * Change history:
 * 0.1.0 - Implemented the email method.
 * 0.2.0 - Uses trace method for initialisation statement.
 * 0.3.0 - Removed excess semi-colons.
 * 0.4.0 - Updated comments.
 * 1.0.0 - Reworked logging string crafting methods. Added more configuration.
 * 1.1.0 - JSDoc comments and refactored method formatting.
 * 2.1.0 - No longer instantiatable, requires use of static register method.
 * 2.1.1 - Updated initialise log.
 * 2.1.2 - Removed initialise log.
 * 2.2.1 - Now using Factory class.
 * 2.2.2 - Cleaning line lengths.
 * 2.2.3 - Updated configuration unpacking.
 * 2.2.4 - Created outputGuard method.
 * 2.2.5 - Shorthand timestamp.
 */
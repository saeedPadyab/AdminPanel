import React, { useState, useEffect } from "react";
import { Modal, ModalFooter } from "reactstrap";
import { languageManager, useGlobalState, utility } from "../../../../services";
import { updateField } from "./../../../../Api/contentType-api";
import "./styles.scss";

const acceptedMediaTypes = [
  {
    id: 1,
    name: "all",
    title: "All Files"
  },
  {
    id: 2,
    name: "image",
    title: "Image"
  },
  {
    id: 3,
    name: "video",
    title: "Video"
  },
  {
    id: 4,
    name: "audio",
    title: "Audio"
  },
  {
    id: 5,
    name: "pdf",
    title: "PDF"
  },
  {
    id: 6,
    name: "spreadsheet",
    title: "Spreadsheet"
  }
];
const translatableFields = ["string", "media", "richText"];

const FieldConfig = props => {
  //#region variables
  const { selectedContentType } = props;
  const currentLang = languageManager.getCurrentLanguage().name;
  const [{ contentTypes }, dispatch] = useGlobalState();
  const { selectedField } = props;

  const [isOpen, toggleModal] = useState(true);
  const [tab, changeTab] = useState(1);
  const [name, setName] = useState(selectedField.name);
  const [title, setTitle] = useState(selectedField.title[currentLang]);
  const [translation, toggleTranslation] = useState(selectedField.isTranslate);
  const [isRequired, toggleRequired] = useState(
    selectedField.isRequired === true ? true : false
  );

  const [imageUploadMethod, setImageUploadMethod] = useState(
    selectedField.isList === true ? "manyFiles" : "oneFile"
  );
  const [mediaTypeVisibility, toggleMediaType] = useState(
    selectedField.type === "media" ? true : false
  );
  const [mediaType, setMediaType] = useState(() => {
    if (
      selectedField.mediaType === undefined ||
      selectedField.mediaType === "all"
    ) {
      return acceptedMediaTypes[0];
    } else {
      for (let i = 0; i < acceptedMediaTypes.length; i++) {
        if (acceptedMediaTypes[i].name === selectedField.mediaType) {
          return acceptedMediaTypes[i];
        }
      }
    }
  });

  const [referenceContentTypeChk, toggleReferenceContentType] = useState(
    selectedField.type === "reference"
      ? () => {
          if (selectedField.referenceId === undefined) {
            return false;
          } else return true;
        }
      : false
  );
  const [selectedContentTypeRef, setContentTypeRef] = useState(
    selectedField.type === "reference"
      ? () => {
          if (selectedField.referenceId === undefined) return {};
          for (let i = 0; i < contentTypes.length; i++) {
            if (contentTypes[i].sys.id === selectedField.referenceId) {
              return contentTypes[i];
            }
          }
        }
      : {}
  );

  const [helpText, setHelpText] = useState(
    selectedField.helpText ? selectedField.helpText : ""
  );
  const [booleanTrueText, setBooleanTrueText] = useState(
    selectedField.trueText ? selectedField.trueText : "True"
  );
  const [booleanFalseText, setBooleanFalseText] = useState(
    selectedField.falseText ? selectedField.falseText : "False"
  );
  const [inVisible, toggleInVisible] = useState(
    selectedField.inVisible ? selectedField.inVisible : false
  );
  const [textDefaultValue, setTextDefaultValue] = useState(
    selectedField.type === "string"
      ? selectedField.defaultValue
        ? selectedField.defaultValue
        : ""
      : ""
  );
  const [numberDefaultValue, setNumberDefaultValue] = useState(
    selectedField.type === "number"
      ? selectedField.defaultValue
        ? selectedField.defaultValue
        : ""
      : ""
  );
  const [dateDefaultValue, toggleDateDefaultValue] = useState(
    selectedField.type === "dateTime"
      ? selectedField.showCurrent
        ? selectedField.showCurrent
        : false
      : false
  );
  const [isMultiLine, toggleMultiLine] = useState(
    selectedField.type === "string"
      ? selectedField.isMultiLine
        ? selectedField.isMultiLine
        : false
      : false
  );
  const [dateTimeFormat, toggleDateFormat] = useState(
    selectedField.type === "dateTime"
      ? selectedField.format
        ? selectedField.format
        : "dateTime"
      : "dateTime"
  );
  const [latitude, setLatitude] = useState(
    selectedField.type === "location"
      ? selectedField.defaultValue
        ? selectedField.defaultValue.latitude
        : ""
      : ""
  );
  const [longitude, setLongitude] = useState(
    selectedField.type === "location"
      ? selectedField.defaultValue
        ? selectedField.defaultValue.longitude
        : ""
      : ""
  );
  const [booleanDefaultValue, setBooleanDefaultValue] = useState(
    selectedField.type === "boolean"
      ? selectedField.defaultValue !== undefined
        ? selectedField.defaultValue
        : false
      : false
  );
  const [options, setOptions] = useState(
    selectedField.type === "keyValue"
      ? selectedField.options !== undefined
        ? selectedField.options
        : [{ value: "", selected: false }]
      : [{ value: "", selected: false }]
  );
  //#endregion variables

  useEffect(() => {
    return () => {
      if (!props.isOpen) toggleModal(false);
    };
  }, []);

  //#region methods
  function closeModal(params) {
    props.onCloseModal();
  }
  function handleTextDefaultValue(e) {
    setTextDefaultValue(e.target.value);
  }
  function handleNumberDefaultValue(e) {
    setNumberDefaultValue(e.target.value);
  }
  function handleDateDefaultValue(e) {
    toggleDateDefaultValue(e.target.checked);
  }
  function handleMultiLineChanged(e) {
    toggleMultiLine(e.target.checked);
  }
  function handleChangeTitle(e) {
    setTitle(e.target.value);
  }
  function handleLatitudeChange(e) {
    setLatitude(e.target.value);
  }
  function handleLongitudeChange(e) {
    setLongitude(e.target.value);
  }
  function handleChangeTranslation(e) {
    toggleTranslation(e.target.checked);
  }
  function handleRequireCheckBox(e) {
    toggleRequired(e.target.checked);
  }
  function handleImageUploadMethod(e) {
    setImageUploadMethod(e.target.value);
  }
  function handleReferenceChk(e) {
    toggleReferenceContentType(e.target.checked);
  }
  function handleHelpTextchanged(e) {
    setHelpText(e.target.value);
  }
  function handleBooleanTrueText(e) {
    setBooleanTrueText(e.target.value);
  }
  function handleBooleanFalseText(e) {
    setBooleanFalseText(e.target.value);
  }
  function handleToggleInVisible(e) {
    toggleInVisible(e.target.checked);
  }
  function update() {
    let obj = {
      ...selectedField
    };
    obj["title"] = utility.applyeLangs(title);
    obj["isTranslate"] = translation;
    obj["isRequired"] = isRequired;
    obj["appearance"] = "default";
    if (helpText.length > 0) obj["helpText"] = utility.applyeLangs(helpText);
    if (selectedField.type !== "media" && selectedField.type !== "richText") {
      obj["inVisible"] = inVisible;
    }
    if (selectedField.type === "string") {
      if (textDefaultValue.length > 0) obj["defaultValue"] = textDefaultValue;
      obj["isMultiLine"] = isMultiLine;
    }
    if (selectedField.type === "number" && numberDefaultValue.length > 0) {
      obj["defaultValue"] = numberDefaultValue;
    }
    if (selectedField.type === "dateTime") {
      obj["showCurrent"] = dateDefaultValue;
      obj["format"] = dateTimeFormat;
    }
    if (selectedField.type === "location") {
      obj["defaultValue"] = {
        latitude: latitude,
        longitude: longitude
      };
    }
    if (selectedField.type === "boolean") {
      obj["defaultValue"] = booleanDefaultValue;
    }
    if (selectedField.type === "keyValue") {
      obj["options"] = options.map(item => {
        if (item.value.length > 0) return item;
      });
    }
    if (selectedField.type === "media") {
      obj["isList"] = imageUploadMethod === "oneFile" ? false : true;
      obj["mediaType"] = mediaTypeVisibility
        ? mediaType !== undefined
          ? mediaType.name
          : "file"
        : "file";
    } else if (selectedField.type === "reference") {
      obj["referenceId"] = referenceContentTypeChk
        ? selectedContentTypeRef !== undefined
          ? selectedContentTypeRef.sys.id
          : "all"
        : "all";
    }
    updateField()
      .onOk(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: languageManager.translate(
              "CONTENT_TYPE_UPDATE_FIELD_ON_OK"
            )
          }
        });
        dispatch({
          type: "SET_CONTENT_TYPES",
          value: result
        });
        props.onCloseModal(obj);
      })
      .onServerError(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate(
              "CONTENT_TYPE_UPDATE_FIELD_ON_BAD_REQUEST"
            )
          }
        });
      })
      .onBadRequest(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate(
              "CONTENT_TYPE_UPDATE_FIELD_UN_AUTHORIZED"
            )
          }
        });
      })
      .unAuthorized(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "warning",
            message: languageManager.translate(
              "CONTENT_TYPE_UPDATE_FIELD_UN_AUTHORIZED"
            )
          }
        });
      })
      .notFound(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "warning",
            message: languageManager.translate(
              "CONTENT_TYPE_UPDATE_FIELD_NOT_FOUND"
            )
          }
        });
      })
      .call(selectedContentType.sys.id, obj);
  }
  function addNewOption() {
    let opts = [...options];
    opts.push({
      value: "",
      selected: false
    });
    setOptions(opts);
  }
  function handleOptionValueChanged(e, index) {
    const opts = options.map((item, i) => {
      if (i === index) item.value = e.target.value;
      return item;
    });
    setOptions(opts);
  }
  function removeOption(item, index) {
    if (options.length > 1) {
      const opts = options.filter((item, i) => i !== index);
      setOptions(opts);
    }
  }
  function setSelectedOption(item, index) {
    const opts = options.map((item, i) => {
      item.selected = false;
      if (i === index) item.selected = true;
      return item;
    });
    setOptions(opts);
  }
  //#endregion methods
  return (
    <Modal isOpen={isOpen} toggle={closeModal} size="lg">
      <div className="fieldConfig">
        <div className="fieldConfig-header">
          <div className="left">
            <i
              className={
                selectedField.type === "string"
                  ? "icon-file-text icon"
                  : selectedField.type === "number"
                  ? "icon-number icon"
                  : selectedField.type === "dateTime"
                  ? "icon-calendar icon"
                  : selectedField.type === "location"
                  ? "icon-location icon"
                  : selectedField.type === "media"
                  ? "icon-images icon"
                  : selectedField.type === "jsonObject"
                  ? "icon-json-file icon"
                  : selectedField.type === "reference"
                  ? "icon-reference icon"
                  : selectedField.type === "boolean"
                  ? "icon-boolean icon"
                  : "icon-file-text icon"
              }
            />
            <span className="fieldName">{selectedField.name}</span>
            <span className="fieldType">{selectedField.type}</span>
          </div>
          <div className="right">
            <div
              className="tabItem"
              style={{
                background: tab === 1 ? "white" : "whitesmoke"
              }}
              onClick={() => changeTab(1)}
            >
              Settings
            </div>
            <div
              className="tabItem"
              style={{
                background: tab === 2 ? "white" : "whitesmoke"
              }}
              onClick={() => changeTab(2)}
            >
              Validations
            </div>
            <div
              className="tabItem"
              style={{
                background: tab === 3 ? "white" : "whitesmoke"
              }}
              onClick={() => changeTab(3)}
            >
              Appearance
            </div>
          </div>
        </div>
        <div className="body">
          {tab === 1 && (
            <div className="firstTab">
              <div className="row">
                <div className="form-group col">
                  <label>{languageManager.translate("NAME")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    readOnly
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_NAME_INFO"
                    )}
                  </small>
                </div>
                <div className="form-group col">
                  <label>{languageManager.translate("TITLE")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={handleChangeTitle}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate("TITLE_INFO")}
                  </small>
                </div>
              </div>
              {selectedField.type === "location" && (
                <div className="row">
                  <div className="form-group col">
                    <label>
                      {languageManager.translate("FIELD_LOCATION_LATITUDE")}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={latitude}
                      onChange={handleLatitudeChange}
                    />
                    <small className="form-text text-muted">
                      {languageManager.translate(
                        "FIELD_LOCATION_LATITUDE_INFO"
                      )}
                    </small>
                  </div>
                  <div className="form-group col">
                    <label>
                      {languageManager.translate("FIELD_LOCATION_LONGITUDE")}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={longitude}
                      onChange={handleLongitudeChange}
                    />
                    <small className="form-text text-muted">
                      {languageManager.translate(
                        "FIELD_LOCATION_LONGITUDE_INFO"
                      )}
                    </small>
                  </div>
                </div>
              )}
              {selectedField.type === "string" && (
                <div className="form-group">
                  <label>
                    {languageManager.translate("DEFAULT_VALUE_TEXT")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={textDefaultValue}
                    onChange={handleTextDefaultValue}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate("DEFAULT_VALUE_TEXT_INFO")}
                  </small>
                </div>
              )}
              {selectedField.type === "number" && (
                <div className="form-group">
                  <label>
                    {languageManager.translate("DEFAULT_VALUE_NUMBER")}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={numberDefaultValue}
                    onChange={handleNumberDefaultValue}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate("DEFAULT_VALUE_NUMBER_INFO")}
                  </small>
                </div>
              )}
              {selectedField.type === "boolean" && (
                <div
                  className="inputSwitch"
                  style={{
                    marginBottom: 20
                  }}
                >
                  <span>
                    {languageManager.translate("FIELD_BOOLEAN_DEFAULT_VALUE")}
                  </span>
                  <span>
                    {languageManager.translate(
                      "FIELD_BOOLEAN_DEFAULT_VALUE_INFO"
                    )}
                  </span>
                  <div className="inputSwitch-content">
                    <button
                      className={
                        "btn btn-sm " +
                        (booleanDefaultValue ? "btn-primary" : "btn-light")
                      }
                      onClick={() => setBooleanDefaultValue(true)}
                    >
                      {languageManager.translate("TRUE")}
                    </button>
                    <button
                      className={
                        "btn btn-sm " +
                        (!booleanDefaultValue ? "btn-primary" : "btn-light")
                      }
                      onClick={() => setBooleanDefaultValue(false)}
                    >
                      {languageManager.translate("FALSE")}
                    </button>
                  </div>
                </div>
              )}
              {selectedField.type !== "media" &&
                selectedField.type !== "richText" && (
                  <div className="custom_checkbox">
                    <div className="left">
                      <label className="checkBox">
                        <input
                          type="checkbox"
                          id="invisible"
                          checked={inVisible}
                          onChange={handleToggleInVisible}
                        />
                        <span className="checkmark" />
                      </label>
                    </div>
                    <div className="right">
                      <label for="invisible">
                        {languageManager.translate("FIELD_INVISIBLE")}
                      </label>
                      <label for="invisible">
                        {languageManager.translate("FIELD_INVISIBLE_INFO")}
                      </label>
                    </div>
                  </div>
                )}
              {translatableFields.indexOf(selectedField.type) > -1 && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="localization"
                        checked={translation}
                        onChange={handleChangeTranslation}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label for="localization">
                      {languageManager.translate("TRANSLATION")}
                    </label>
                    <label>
                      {languageManager.translate("TRANSLATION_INFO")}
                    </label>
                  </div>
                </div>
              )}
              {selectedField.type === "dateTime" && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="dateShowCurrent"
                        checked={dateDefaultValue}
                        onChange={handleDateDefaultValue}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label for="dateShowCurrent">
                      {languageManager.translate("FIELD_DATE_SHOW_CURRENT")}
                    </label>
                    <label>
                      {languageManager.translate(
                        "FIELD_DATE_SHOW_CURRENT_INFO"
                      )}
                    </label>
                  </div>
                </div>
              )}
              {selectedField.type === "string" && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="multiLine"
                        checked={isMultiLine}
                        onChange={handleMultiLineChanged}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label for="multiLine">
                      {languageManager.translate("FIELD_STRING_MULTILINE")}
                    </label>
                    <label for="multiLine">
                      {languageManager.translate("FIELD_STRING_MULTILINE_INFO")}
                    </label>
                  </div>
                </div>
              )}
              {selectedField.type === "media" && (
                <>
                  <div className="custom_checkbox ">
                    <div className="left">
                      <label className="radio">
                        <input
                          type="radio"
                          value="oneFile"
                          checked={imageUploadMethod === "oneFile"}
                          name="uploadFileMethod"
                          onChange={handleImageUploadMethod}
                          id="oneFileRadio"
                        />
                        <span className="checkround" />
                      </label>
                    </div>
                    <div className="right">
                      <label for="oneFileRadio">One File</label>
                      <label>
                        Select this if there is only one thing to store For
                        example, a single photo or one PDF file
                      </label>
                    </div>
                  </div>
                  <div className="custom_checkbox">
                    <div className="left">
                      <label className="radio">
                        <input
                          type="radio"
                          value="manyFiles"
                          checked={imageUploadMethod === "manyFiles"}
                          name="uploadFileMethod"
                          onChange={handleImageUploadMethod}
                          id="manyFileRadio"
                        />
                        <span className="checkround" />
                      </label>
                    </div>
                    <div className="right">
                      <label for="manyFileRadio">Many Files</label>
                      <label>
                        Select this if there are several things to be stored For
                        example, several photos or PDF files
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {tab === 2 && (
            <div className="secondTab">
              <div className="custom_checkbox">
                <div className="left">
                  <label className="checkBox">
                    <input
                      type="checkbox"
                      id="isRequired"
                      checked={isRequired}
                      onChange={handleRequireCheckBox}
                    />
                    <span className="checkmark" />
                  </label>
                </div>
                <div className="right">
                  <label for="isRequired">Required</label>
                  <label>
                    You won't be able to publish an entry if this field is empty
                  </label>
                </div>
              </div>
              {selectedField.type === "media" && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="mediaType"
                        checked={mediaTypeVisibility}
                        onChange={() =>
                          toggleMediaType(prevState => !prevState)
                        }
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label for="mediaType">
                      Accept only specified file types
                    </label>
                    <label>
                      Make this field only accept specified file types
                    </label>
                    {mediaTypeVisibility && (
                      <div className="validation-configs">
                        {acceptedMediaTypes.map((type, index) => (
                          <button
                            key={"btnType" + index}
                            className={
                              "btn btn-sm " +
                              (mediaType.name === type.name
                                ? "btn-primary"
                                : "btn-light")
                            }
                            onClick={() => setMediaType(type)}
                          >
                            {type.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedField.type === "reference" && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="referenceChk"
                        checked={referenceContentTypeChk}
                        onChange={handleReferenceChk}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label for="referenceChk">
                      Accept only specified entry type
                    </label>
                    <label>
                      Make this field only accept entries from specified content
                      type(s)
                    </label>
                    {referenceContentTypeChk && (
                      <div className="validation-configs">
                        {contentTypes.map((item, index) => (
                          <button
                            className={
                              "btn btn-sm " +
                              (selectedContentTypeRef.sys
                                ? selectedContentTypeRef.sys.id === item.sys.id
                                  ? "btn-primary"
                                  : "btn-light"
                                : "btn-light")
                            }
                            key={item.sys.id}
                            onClick={() => setContentTypeRef(item)}
                          >
                            {item.title[currentLang]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {tab === 3 && (
            <div className="thirdTab">
              <span className="thirdTab-title">
                Chooes how this field should be displayed
              </span>
              <div className="apearanceUiList">
                <div className="apearanceItem">
                  Default
                  <div className="activeItem">
                    <i className="icon-checkmark" />
                  </div>
                </div>
              </div>
              <div>
                <div className="form-group">
                  <label>{languageManager.translate("Help Text")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={helpText}
                    placeholder={languageManager.translate(
                      "Try to enter maximum 255 char"
                    )}
                    onChange={handleHelpTextchanged}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate(
                      "This help text will show up below the field"
                    )}
                  </small>
                </div>
                {selectedField.type === "dateTime" && (
                  <div className="inputSwitch">
                    <span>
                      {languageManager.translate("FIELD_DATE_FORMAT_TITLE")}
                    </span>
                    <span>
                      {languageManager.translate(
                        "FIELD_DATE_FORMAT_TITLE_INFO"
                      )}
                    </span>
                    <div className="inputSwitch-content">
                      <button
                        className={
                          "btn btn-sm " +
                          (dateTimeFormat === "dateTime"
                            ? "btn-primary"
                            : "btn-light")
                        }
                        onClick={() => toggleDateFormat("dateTime")}
                      >
                        {languageManager.translate(
                          "FIELD_DATE_FORMAT_DATE_TIME"
                        )}
                      </button>
                      <button
                        className={
                          "btn btn-sm " +
                          (dateTimeFormat === "date"
                            ? "btn-primary"
                            : "btn-light")
                        }
                        onClick={() => toggleDateFormat("date")}
                      >
                        {languageManager.translate("FIELD_DATE_FORMAT_DATE")}
                      </button>
                      <button
                        className={
                          "btn btn-sm " +
                          (dateTimeFormat === "time"
                            ? "btn-primary"
                            : "btn-light")
                        }
                        onClick={() => toggleDateFormat("time")}
                      >
                        {languageManager.translate("FIELD_DATE_FORMAT_TIME")}
                      </button>
                    </div>
                  </div>
                )}
                {selectedField.type === "keyValue" && (
                  <>
                    <span>
                      {languageManager.translate("FIELD_OPTIONS_TITLE")}
                    </span>
                    {options.map((item, index) => (
                      <div className="options" key={index}>
                        <div className="leftInput">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={languageManager.translate(
                              "FIELD_OPTIONS_VALUE"
                            )}
                            value={options[index].value}
                            onChange={e => handleOptionValueChanged(e, index)}
                          />
                        </div>
                        <div className="rightInput">
                          <button
                            className="btn btn-light"
                            onClick={() => setSelectedOption(item, index)}
                          >
                            <i
                              className="icon-checkmark"
                              style={{
                                visibility: item.selected ? "visible" : "hidden"
                              }}
                            />
                          </button>
                          <button
                            className="btn btn-light"
                            onClick={() => removeOption(item, index)}
                          >
                            <i className="icon-bin" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-danger btn-plus btn-sm"
                      onClick={addNewOption}
                    >
                      <i className="icon-plus" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <ModalFooter>
          <button className="btn btn-primary" onClick={update}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={closeModal}>
            Close
          </button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default FieldConfig;

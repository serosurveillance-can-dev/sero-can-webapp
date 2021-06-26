import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useContext} from "react";
import Translate from "../../../utils/translate/translateService";
import { Card } from "semantic-ui-react";
import { AppContext } from "../../../context";
import { LanguageType } from "../../../types";

export interface PublicationsCardProps {
  day?: string,
  month: string,
  year: string,
  titleKey1: string,
  titleKey2: string[],
  img?: string,
  url: string,
  italicize?: string
}

export function PublicationsCard(props: PublicationsCardProps) {
  const [state] = useContext(AppContext);
  return (
    <div className="py-4 px-2">
      <Card className={props.img ? "publications-card" : "publications-card-no-img"}> 
        {props.img && (
          <Card.Content>
            <div className="flex center-item publications-card-image mb-2">
              <img src={props.img} alt="" className="fit publications-card-image"></img>
              <a href={props.url}
                target="_blank"
                rel="noopener noreferrer"
                className="overlay flex">
                <div className="publications-card-image-overlay flex fill center-item column">
                  <div>{Translate('ViewFile')}</div>
                  <div className="flex center-item">
                    <FontAwesomeIcon
                      icon={faFile}
                      className={'icon'}
                      color={'white'}
                      size={"lg"} />
                  </div>
                </div>
              </a>
            </div>
          </Card.Content>
        )}
        <Card.Content>
          <div className="publications-card-title pb-1">
            <a href={props.url} target="_blank" rel="noopener noreferrer" className="">
              {props.italicize ? <i>{props.italicize}&nbsp;</i> : null}{Translate(props.titleKey1, props.titleKey2)}
            </a>
          </div>
          <div className="publications-card-date">
            {state.language === LanguageType.english ? `${props.month } ${props.day ? props.day + "," : ""} ` : `${props.day} ${Translate("Months", [props.month])} `}
            {props.year}
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

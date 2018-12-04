module Main exposing (main)

import Browser
import Html exposing (Html, button, div, p, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)



{- MODEL -}


type alias Model =
    { count : Int
    }


initialModel : Model
initialModel =
    { count = 0
    }



{- VIEW -}


view : Model -> Html Msg
view model =
    div []
        [ p [] [ "The count is " ++ String.fromInt model.count |> text ]
        , button [ class "button", onClick Increment ] [ text "+1" ]
        , button [ class "button", onClick Decrement ] [ text "-1" ]
        ]



{- UPDATE -}


type Msg
    = NoOp
    | Increment
    | Decrement


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        Increment ->
            ( { model | count = model.count + 1 }, Cmd.none )

        Decrement ->
            ( { model | count = model.count - 1 }, Cmd.none )



{- SUBSCRIPTIONS -}


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



{- MAIN -}


init : Bool -> ( Model, Cmd Msg )
init flags =
    ( initialModel, Cmd.none )


main : Program Bool Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

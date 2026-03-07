--
-- PostgreSQL database dump
--

\restrict fet9u56cWkNV87kbOowu2qUdDb2C55POBS3NzC7tMjbrY6jLwYuLTNM2S5byVwR

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_permissions; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.admin_permissions (
    id integer NOT NULL,
    document_id character varying(255),
    action character varying(255),
    action_parameters jsonb,
    subject character varying(255),
    properties jsonb,
    conditions jsonb,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.admin_permissions ;

--
-- Name: admin_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.admin_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_permissions_id_seq ;

--
-- Name: admin_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.admin_permissions_id_seq OWNED BY public.admin_permissions.id;


--
-- Name: admin_permissions_role_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.admin_permissions_role_lnk (
    id integer NOT NULL,
    permission_id integer,
    role_id integer,
    permission_ord double precision
);


ALTER TABLE public.admin_permissions_role_lnk ;

--
-- Name: admin_permissions_role_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.admin_permissions_role_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_permissions_role_lnk_id_seq ;

--
-- Name: admin_permissions_role_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.admin_permissions_role_lnk_id_seq OWNED BY public.admin_permissions_role_lnk.id;


--
-- Name: admin_roles; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.admin_roles (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    code character varying(255),
    description character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.admin_roles ;

--
-- Name: admin_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.admin_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_roles_id_seq ;

--
-- Name: admin_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.admin_roles_id_seq OWNED BY public.admin_roles.id;


--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    document_id character varying(255),
    firstname character varying(255),
    lastname character varying(255),
    username character varying(255),
    email character varying(255),
    password character varying(255),
    reset_password_token character varying(255),
    registration_token character varying(255),
    is_active boolean,
    blocked boolean,
    prefered_language character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.admin_users ;

--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq ;

--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: admin_users_roles_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.admin_users_roles_lnk (
    id integer NOT NULL,
    user_id integer,
    role_id integer,
    role_ord double precision,
    user_ord double precision
);


ALTER TABLE public.admin_users_roles_lnk ;

--
-- Name: admin_users_roles_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.admin_users_roles_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_roles_lnk_id_seq ;

--
-- Name: admin_users_roles_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.admin_users_roles_lnk_id_seq OWNED BY public.admin_users_roles_lnk.id;


--
-- Name: authors; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.authors (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    slug character varying(255),
    bio jsonb,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.authors ;

--
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.authors_id_seq ;

--
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    slug character varying(255),
    description text,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.categories ;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq ;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: categories_stories_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.categories_stories_lnk (
    id integer NOT NULL,
    category_id integer,
    story_id integer,
    story_ord double precision,
    category_ord double precision
);


ALTER TABLE public.categories_stories_lnk ;

--
-- Name: categories_stories_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.categories_stories_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_stories_lnk_id_seq ;

--
-- Name: categories_stories_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.categories_stories_lnk_id_seq OWNED BY public.categories_stories_lnk.id;


--
-- Name: chapters; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.chapters (
    id integer NOT NULL,
    document_id character varying(255),
    title character varying(255),
    slug character varying(255),
    chapter_number numeric(10,2),
    content jsonb,
    view_count bigint,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255),
    chap_published_at date,
    is_vip_only boolean
);


ALTER TABLE public.chapters ;

--
-- Name: chapters_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.chapters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chapters_id_seq ;

--
-- Name: chapters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.chapters_id_seq OWNED BY public.chapters.id;


--
-- Name: chapters_story_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.chapters_story_lnk (
    id integer NOT NULL,
    chapter_id integer,
    story_id integer,
    chapter_ord double precision
);


ALTER TABLE public.chapters_story_lnk ;

--
-- Name: chapters_story_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.chapters_story_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chapters_story_lnk_id_seq ;

--
-- Name: chapters_story_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.chapters_story_lnk_id_seq OWNED BY public.chapters_story_lnk.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    document_id character varying(255),
    content text,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.comments ;

--
-- Name: comments_chapter_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.comments_chapter_lnk (
    id integer NOT NULL,
    comment_id integer,
    chapter_id integer,
    comment_ord double precision
);


ALTER TABLE public.comments_chapter_lnk ;

--
-- Name: comments_chapter_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.comments_chapter_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_chapter_lnk_id_seq ;

--
-- Name: comments_chapter_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.comments_chapter_lnk_id_seq OWNED BY public.comments_chapter_lnk.id;


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq ;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: comments_parent_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.comments_parent_lnk (
    id integer NOT NULL,
    comment_id integer,
    inv_comment_id integer
);


ALTER TABLE public.comments_parent_lnk ;

--
-- Name: comments_parent_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.comments_parent_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_parent_lnk_id_seq ;

--
-- Name: comments_parent_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.comments_parent_lnk_id_seq OWNED BY public.comments_parent_lnk.id;


--
-- Name: comments_sticker_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.comments_sticker_lnk (
    id integer NOT NULL,
    comment_id integer,
    sticker_id integer
);


ALTER TABLE public.comments_sticker_lnk ;

--
-- Name: comments_sticker_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.comments_sticker_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_sticker_lnk_id_seq ;

--
-- Name: comments_sticker_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.comments_sticker_lnk_id_seq OWNED BY public.comments_sticker_lnk.id;


--
-- Name: comments_story_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.comments_story_lnk (
    id integer NOT NULL,
    comment_id integer,
    story_id integer,
    comment_ord double precision
);


ALTER TABLE public.comments_story_lnk ;

--
-- Name: comments_story_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.comments_story_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_story_lnk_id_seq ;

--
-- Name: comments_story_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.comments_story_lnk_id_seq OWNED BY public.comments_story_lnk.id;


--
-- Name: comments_user_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.comments_user_lnk (
    id integer NOT NULL,
    comment_id integer,
    user_id integer,
    comment_ord double precision
);


ALTER TABLE public.comments_user_lnk ;

--
-- Name: comments_user_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.comments_user_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_user_lnk_id_seq ;

--
-- Name: comments_user_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.comments_user_lnk_id_seq OWNED BY public.comments_user_lnk.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.files (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    alternative_text text,
    caption text,
    focal_point jsonb,
    width integer,
    height integer,
    formats jsonb,
    hash character varying(255),
    ext character varying(255),
    mime character varying(255),
    size numeric(10,2),
    url text,
    preview_url text,
    provider character varying(255),
    provider_metadata jsonb,
    folder_path character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.files ;

--
-- Name: files_folder_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.files_folder_lnk (
    id integer NOT NULL,
    file_id integer,
    folder_id integer,
    file_ord double precision
);


ALTER TABLE public.files_folder_lnk ;

--
-- Name: files_folder_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.files_folder_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_folder_lnk_id_seq ;

--
-- Name: files_folder_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.files_folder_lnk_id_seq OWNED BY public.files_folder_lnk.id;


--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_id_seq ;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: files_related_mph; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.files_related_mph (
    id integer NOT NULL,
    file_id integer,
    related_id integer,
    related_type character varying(255),
    field character varying(255),
    "order" double precision
);


ALTER TABLE public.files_related_mph ;

--
-- Name: files_related_mph_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.files_related_mph_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_related_mph_id_seq ;

--
-- Name: files_related_mph_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.files_related_mph_id_seq OWNED BY public.files_related_mph.id;


--
-- Name: follows; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.follows (
    id integer NOT NULL,
    document_id character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255),
    follow_at timestamp(6) without time zone
);


ALTER TABLE public.follows ;

--
-- Name: follows_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.follows_id_seq ;

--
-- Name: follows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.follows_id_seq OWNED BY public.follows.id;


--
-- Name: follows_story_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.follows_story_lnk (
    id integer NOT NULL,
    follow_id integer,
    story_id integer,
    follow_ord double precision
);


ALTER TABLE public.follows_story_lnk ;

--
-- Name: follows_story_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.follows_story_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.follows_story_lnk_id_seq ;

--
-- Name: follows_story_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.follows_story_lnk_id_seq OWNED BY public.follows_story_lnk.id;


--
-- Name: follows_user_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.follows_user_lnk (
    id integer NOT NULL,
    follow_id integer,
    user_id integer,
    follow_ord double precision
);


ALTER TABLE public.follows_user_lnk ;

--
-- Name: follows_user_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.follows_user_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.follows_user_lnk_id_seq ;

--
-- Name: follows_user_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.follows_user_lnk_id_seq OWNED BY public.follows_user_lnk.id;


--
-- Name: i18n_locale; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.i18n_locale (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    code character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.i18n_locale ;

--
-- Name: i18n_locale_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.i18n_locale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.i18n_locale_id_seq ;

--
-- Name: i18n_locale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.i18n_locale_id_seq OWNED BY public.i18n_locale.id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    document_id character varying(255),
    score integer,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.ratings ;

--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ratings_id_seq ;

--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: ratings_story_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.ratings_story_lnk (
    id integer NOT NULL,
    rating_id integer,
    story_id integer,
    rating_ord double precision
);


ALTER TABLE public.ratings_story_lnk ;

--
-- Name: ratings_story_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.ratings_story_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ratings_story_lnk_id_seq ;

--
-- Name: ratings_story_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.ratings_story_lnk_id_seq OWNED BY public.ratings_story_lnk.id;


--
-- Name: ratings_user_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.ratings_user_lnk (
    id integer NOT NULL,
    rating_id integer,
    user_id integer,
    rating_ord double precision
);


ALTER TABLE public.ratings_user_lnk ;

--
-- Name: ratings_user_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.ratings_user_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ratings_user_lnk_id_seq ;

--
-- Name: ratings_user_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.ratings_user_lnk_id_seq OWNED BY public.ratings_user_lnk.id;


--
-- Name: reading-histories; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public."reading-histories" (
    id integer NOT NULL,
    document_id character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255),
    history_updated_at timestamp(6) without time zone
);


ALTER TABLE public."reading-histories" ;

--
-- Name: reading-histories_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public."reading-histories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."reading-histories_id_seq" ;

--
-- Name: reading-histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public."reading-histories_id_seq" OWNED BY public."reading-histories".id;


--
-- Name: reading_histories_chapter_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.reading_histories_chapter_lnk (
    id integer NOT NULL,
    reading_history_id integer,
    chapter_id integer,
    reading_history_ord double precision
);


ALTER TABLE public.reading_histories_chapter_lnk ;

--
-- Name: reading_histories_chapter_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.reading_histories_chapter_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reading_histories_chapter_lnk_id_seq ;

--
-- Name: reading_histories_chapter_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.reading_histories_chapter_lnk_id_seq OWNED BY public.reading_histories_chapter_lnk.id;


--
-- Name: reading_histories_story_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.reading_histories_story_lnk (
    id integer NOT NULL,
    reading_history_id integer,
    story_id integer,
    reading_history_ord double precision
);


ALTER TABLE public.reading_histories_story_lnk ;

--
-- Name: reading_histories_story_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.reading_histories_story_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reading_histories_story_lnk_id_seq ;

--
-- Name: reading_histories_story_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.reading_histories_story_lnk_id_seq OWNED BY public.reading_histories_story_lnk.id;


--
-- Name: reading_histories_user_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.reading_histories_user_lnk (
    id integer NOT NULL,
    reading_history_id integer,
    user_id integer,
    reading_history_ord double precision
);


ALTER TABLE public.reading_histories_user_lnk ;

--
-- Name: reading_histories_user_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.reading_histories_user_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reading_histories_user_lnk_id_seq ;

--
-- Name: reading_histories_user_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.reading_histories_user_lnk_id_seq OWNED BY public.reading_histories_user_lnk.id;


--
-- Name: reports; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    document_id character varying(255),
    title character varying(255),
    type character varying(255),
    description text,
    location_url character varying(255),
    status character varying(255),
    contact_email character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.reports ;

--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_id_seq ;

--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- Name: reports_reporter_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.reports_reporter_lnk (
    id integer NOT NULL,
    report_id integer,
    user_id integer,
    report_ord double precision
);


ALTER TABLE public.reports_reporter_lnk ;

--
-- Name: reports_reporter_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.reports_reporter_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_reporter_lnk_id_seq ;

--
-- Name: reports_reporter_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.reports_reporter_lnk_id_seq OWNED BY public.reports_reporter_lnk.id;


--
-- Name: sticker_packs; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.sticker_packs (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.sticker_packs ;

--
-- Name: sticker_packs_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.sticker_packs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sticker_packs_id_seq ;

--
-- Name: sticker_packs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.sticker_packs_id_seq OWNED BY public.sticker_packs.id;


--
-- Name: stickers; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.stickers (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    duration numeric(10,2),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.stickers ;

--
-- Name: stickers_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.stickers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stickers_id_seq ;

--
-- Name: stickers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.stickers_id_seq OWNED BY public.stickers.id;


--
-- Name: stickers_pack_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.stickers_pack_lnk (
    id integer NOT NULL,
    sticker_id integer,
    sticker_pack_id integer,
    sticker_ord double precision
);


ALTER TABLE public.stickers_pack_lnk ;

--
-- Name: stickers_pack_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.stickers_pack_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stickers_pack_lnk_id_seq ;

--
-- Name: stickers_pack_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.stickers_pack_lnk_id_seq OWNED BY public.stickers_pack_lnk.id;


--
-- Name: stories; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.stories (
    id integer NOT NULL,
    document_id character varying(255),
    title character varying(255),
    slug character varying(255),
    description jsonb,
    total_chapters integer,
    view_count bigint,
    follow_count integer,
    rating numeric(10,2),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255),
    story_status character varying(255),
    story_published_at date,
    is_featured boolean,
    is_trending boolean,
    is_adult_content boolean
);


ALTER TABLE public.stories ;

--
-- Name: stories_author_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.stories_author_lnk (
    id integer NOT NULL,
    story_id integer,
    author_id integer,
    story_ord double precision
);


ALTER TABLE public.stories_author_lnk ;

--
-- Name: stories_author_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.stories_author_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stories_author_lnk_id_seq ;

--
-- Name: stories_author_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.stories_author_lnk_id_seq OWNED BY public.stories_author_lnk.id;


--
-- Name: stories_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.stories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stories_id_seq ;

--
-- Name: stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.stories_id_seq OWNED BY public.stories.id;


--
-- Name: strapi_ai_localization_jobs; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_ai_localization_jobs (
    id integer NOT NULL,
    content_type character varying(255) NOT NULL,
    related_document_id character varying(255) NOT NULL,
    source_locale character varying(255) NOT NULL,
    target_locales jsonb NOT NULL,
    status character varying(255) NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone
);


ALTER TABLE public.strapi_ai_localization_jobs ;

--
-- Name: strapi_ai_localization_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_ai_localization_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_ai_localization_jobs_id_seq ;

--
-- Name: strapi_ai_localization_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_ai_localization_jobs_id_seq OWNED BY public.strapi_ai_localization_jobs.id;


--
-- Name: strapi_ai_metadata_jobs; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_ai_metadata_jobs (
    id integer NOT NULL,
    status character varying(255) NOT NULL,
    created_at timestamp(6) without time zone,
    completed_at timestamp(6) without time zone
);


ALTER TABLE public.strapi_ai_metadata_jobs ;

--
-- Name: strapi_ai_metadata_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_ai_metadata_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_ai_metadata_jobs_id_seq ;

--
-- Name: strapi_ai_metadata_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_ai_metadata_jobs_id_seq OWNED BY public.strapi_ai_metadata_jobs.id;


--
-- Name: strapi_api_token_permissions; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_api_token_permissions (
    id integer NOT NULL,
    document_id character varying(255),
    action character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_api_token_permissions ;

--
-- Name: strapi_api_token_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_api_token_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_api_token_permissions_id_seq ;

--
-- Name: strapi_api_token_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_api_token_permissions_id_seq OWNED BY public.strapi_api_token_permissions.id;


--
-- Name: strapi_api_token_permissions_token_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_api_token_permissions_token_lnk (
    id integer NOT NULL,
    api_token_permission_id integer,
    api_token_id integer,
    api_token_permission_ord double precision
);


ALTER TABLE public.strapi_api_token_permissions_token_lnk ;

--
-- Name: strapi_api_token_permissions_token_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_api_token_permissions_token_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_api_token_permissions_token_lnk_id_seq ;

--
-- Name: strapi_api_token_permissions_token_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_api_token_permissions_token_lnk_id_seq OWNED BY public.strapi_api_token_permissions_token_lnk.id;


--
-- Name: strapi_api_tokens; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_api_tokens (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    description character varying(255),
    type character varying(255),
    access_key character varying(255),
    encrypted_key text,
    last_used_at timestamp(6) without time zone,
    expires_at timestamp(6) without time zone,
    lifespan bigint,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_api_tokens ;

--
-- Name: strapi_api_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_api_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_api_tokens_id_seq ;

--
-- Name: strapi_api_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_api_tokens_id_seq OWNED BY public.strapi_api_tokens.id;


--
-- Name: strapi_core_store_settings; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_core_store_settings (
    id integer NOT NULL,
    key character varying(255),
    value text,
    type character varying(255),
    environment character varying(255),
    tag character varying(255)
);


ALTER TABLE public.strapi_core_store_settings ;

--
-- Name: strapi_core_store_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_core_store_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_core_store_settings_id_seq ;

--
-- Name: strapi_core_store_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_core_store_settings_id_seq OWNED BY public.strapi_core_store_settings.id;


--
-- Name: strapi_database_schema; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_database_schema (
    id integer NOT NULL,
    schema json,
    "time" timestamp without time zone,
    hash character varying(255)
);


ALTER TABLE public.strapi_database_schema ;

--
-- Name: strapi_database_schema_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_database_schema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_database_schema_id_seq ;

--
-- Name: strapi_database_schema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_database_schema_id_seq OWNED BY public.strapi_database_schema.id;


--
-- Name: strapi_history_versions; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_history_versions (
    id integer NOT NULL,
    content_type character varying(255) NOT NULL,
    related_document_id character varying(255),
    locale character varying(255),
    status character varying(255),
    data jsonb,
    schema jsonb,
    created_at timestamp(6) without time zone,
    created_by_id integer
);


ALTER TABLE public.strapi_history_versions ;

--
-- Name: strapi_history_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_history_versions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_history_versions_id_seq ;

--
-- Name: strapi_history_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_history_versions_id_seq OWNED BY public.strapi_history_versions.id;


--
-- Name: strapi_migrations; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_migrations (
    id integer NOT NULL,
    name character varying(255),
    "time" timestamp without time zone
);


ALTER TABLE public.strapi_migrations ;

--
-- Name: strapi_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_migrations_id_seq ;

--
-- Name: strapi_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_migrations_id_seq OWNED BY public.strapi_migrations.id;


--
-- Name: strapi_migrations_internal; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_migrations_internal (
    id integer NOT NULL,
    name character varying(255),
    "time" timestamp without time zone
);


ALTER TABLE public.strapi_migrations_internal ;

--
-- Name: strapi_migrations_internal_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_migrations_internal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_migrations_internal_id_seq ;

--
-- Name: strapi_migrations_internal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_migrations_internal_id_seq OWNED BY public.strapi_migrations_internal.id;


--
-- Name: strapi_release_actions; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_release_actions (
    id integer NOT NULL,
    document_id character varying(255),
    type character varying(255),
    content_type character varying(255),
    entry_document_id character varying(255),
    locale character varying(255),
    is_entry_valid boolean,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);


ALTER TABLE public.strapi_release_actions ;

--
-- Name: strapi_release_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_release_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_release_actions_id_seq ;

--
-- Name: strapi_release_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_release_actions_id_seq OWNED BY public.strapi_release_actions.id;


--
-- Name: strapi_release_actions_release_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_release_actions_release_lnk (
    id integer NOT NULL,
    release_action_id integer,
    release_id integer,
    release_action_ord double precision
);


ALTER TABLE public.strapi_release_actions_release_lnk ;

--
-- Name: strapi_release_actions_release_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_release_actions_release_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_release_actions_release_lnk_id_seq ;

--
-- Name: strapi_release_actions_release_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_release_actions_release_lnk_id_seq OWNED BY public.strapi_release_actions_release_lnk.id;


--
-- Name: strapi_releases; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_releases (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    released_at timestamp(6) without time zone,
    scheduled_at timestamp(6) without time zone,
    timezone character varying(255),
    status character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_releases ;

--
-- Name: strapi_releases_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_releases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_releases_id_seq ;

--
-- Name: strapi_releases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_releases_id_seq OWNED BY public.strapi_releases.id;


--
-- Name: strapi_sessions; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_sessions (
    id integer NOT NULL,
    document_id character varying(255),
    user_id character varying(255),
    session_id character varying(255),
    child_id character varying(255),
    device_id character varying(255),
    origin character varying(255),
    expires_at timestamp(6) without time zone,
    absolute_expires_at timestamp(6) without time zone,
    status character varying(255),
    type character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_sessions ;

--
-- Name: strapi_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_sessions_id_seq ;

--
-- Name: strapi_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_sessions_id_seq OWNED BY public.strapi_sessions.id;


--
-- Name: strapi_transfer_token_permissions; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_transfer_token_permissions (
    id integer NOT NULL,
    document_id character varying(255),
    action character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_transfer_token_permissions ;

--
-- Name: strapi_transfer_token_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_transfer_token_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_transfer_token_permissions_id_seq ;

--
-- Name: strapi_transfer_token_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_transfer_token_permissions_id_seq OWNED BY public.strapi_transfer_token_permissions.id;


--
-- Name: strapi_transfer_token_permissions_token_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_transfer_token_permissions_token_lnk (
    id integer NOT NULL,
    transfer_token_permission_id integer,
    transfer_token_id integer,
    transfer_token_permission_ord double precision
);


ALTER TABLE public.strapi_transfer_token_permissions_token_lnk ;

--
-- Name: strapi_transfer_token_permissions_token_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_transfer_token_permissions_token_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_transfer_token_permissions_token_lnk_id_seq ;

--
-- Name: strapi_transfer_token_permissions_token_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_transfer_token_permissions_token_lnk_id_seq OWNED BY public.strapi_transfer_token_permissions_token_lnk.id;


--
-- Name: strapi_transfer_tokens; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_transfer_tokens (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    description character varying(255),
    access_key character varying(255),
    last_used_at timestamp(6) without time zone,
    expires_at timestamp(6) without time zone,
    lifespan bigint,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_transfer_tokens ;

--
-- Name: strapi_transfer_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_transfer_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_transfer_tokens_id_seq ;

--
-- Name: strapi_transfer_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_transfer_tokens_id_seq OWNED BY public.strapi_transfer_tokens.id;


--
-- Name: strapi_webhooks; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_webhooks (
    id integer NOT NULL,
    name character varying(255),
    url text,
    headers jsonb,
    events jsonb,
    enabled boolean
);


ALTER TABLE public.strapi_webhooks ;

--
-- Name: strapi_webhooks_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_webhooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_webhooks_id_seq ;

--
-- Name: strapi_webhooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_webhooks_id_seq OWNED BY public.strapi_webhooks.id;


--
-- Name: strapi_workflows; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_workflows (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    content_types jsonb,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_workflows ;

--
-- Name: strapi_workflows_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_workflows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_workflows_id_seq ;

--
-- Name: strapi_workflows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_workflows_id_seq OWNED BY public.strapi_workflows.id;


--
-- Name: strapi_workflows_stage_required_to_publish_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_workflows_stage_required_to_publish_lnk (
    id integer NOT NULL,
    workflow_id integer,
    workflow_stage_id integer
);


ALTER TABLE public.strapi_workflows_stage_required_to_publish_lnk ;

--
-- Name: strapi_workflows_stage_required_to_publish_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_workflows_stage_required_to_publish_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_workflows_stage_required_to_publish_lnk_id_seq ;

--
-- Name: strapi_workflows_stage_required_to_publish_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_workflows_stage_required_to_publish_lnk_id_seq OWNED BY public.strapi_workflows_stage_required_to_publish_lnk.id;


--
-- Name: strapi_workflows_stages; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_workflows_stages (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    color character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_workflows_stages ;

--
-- Name: strapi_workflows_stages_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_workflows_stages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_workflows_stages_id_seq ;

--
-- Name: strapi_workflows_stages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_workflows_stages_id_seq OWNED BY public.strapi_workflows_stages.id;


--
-- Name: strapi_workflows_stages_permissions_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_workflows_stages_permissions_lnk (
    id integer NOT NULL,
    workflow_stage_id integer,
    permission_id integer,
    permission_ord double precision
);


ALTER TABLE public.strapi_workflows_stages_permissions_lnk ;

--
-- Name: strapi_workflows_stages_permissions_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_workflows_stages_permissions_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_workflows_stages_permissions_lnk_id_seq ;

--
-- Name: strapi_workflows_stages_permissions_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_workflows_stages_permissions_lnk_id_seq OWNED BY public.strapi_workflows_stages_permissions_lnk.id;


--
-- Name: strapi_workflows_stages_workflow_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.strapi_workflows_stages_workflow_lnk (
    id integer NOT NULL,
    workflow_stage_id integer,
    workflow_id integer,
    workflow_stage_ord double precision
);


ALTER TABLE public.strapi_workflows_stages_workflow_lnk ;

--
-- Name: strapi_workflows_stages_workflow_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.strapi_workflows_stages_workflow_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_workflows_stages_workflow_lnk_id_seq ;

--
-- Name: strapi_workflows_stages_workflow_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.strapi_workflows_stages_workflow_lnk_id_seq OWNED BY public.strapi_workflows_stages_workflow_lnk.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    slug character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.tags ;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq ;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: up_permissions; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.up_permissions (
    id integer NOT NULL,
    document_id character varying(255),
    action character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.up_permissions ;

--
-- Name: up_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.up_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.up_permissions_id_seq ;

--
-- Name: up_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.up_permissions_id_seq OWNED BY public.up_permissions.id;


--
-- Name: up_permissions_role_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.up_permissions_role_lnk (
    id integer NOT NULL,
    permission_id integer,
    role_id integer,
    permission_ord double precision
);


ALTER TABLE public.up_permissions_role_lnk ;

--
-- Name: up_permissions_role_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.up_permissions_role_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.up_permissions_role_lnk_id_seq ;

--
-- Name: up_permissions_role_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.up_permissions_role_lnk_id_seq OWNED BY public.up_permissions_role_lnk.id;


--
-- Name: up_roles; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.up_roles (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    description character varying(255),
    type character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.up_roles ;

--
-- Name: up_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.up_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.up_roles_id_seq ;

--
-- Name: up_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.up_roles_id_seq OWNED BY public.up_roles.id;


--
-- Name: up_users; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.up_users (
    id integer NOT NULL,
    document_id character varying(255),
    username character varying(255),
    email character varying(255),
    provider character varying(255),
    password character varying(255),
    reset_password_token character varying(255),
    confirmation_token character varying(255),
    confirmed boolean,
    blocked boolean,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255),
    plan character varying(255),
    vip_expired_at timestamp(6) without time zone,
    exp integer,
    level integer,
    avatar_frame character varying(255),
    name_color character varying(255),
    last_daily_exp timestamp(6) without time zone
);


ALTER TABLE public.up_users ;

--
-- Name: up_users_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.up_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.up_users_id_seq ;

--
-- Name: up_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.up_users_id_seq OWNED BY public.up_users.id;


--
-- Name: up_users_role_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.up_users_role_lnk (
    id integer NOT NULL,
    user_id integer,
    role_id integer,
    user_ord double precision
);


ALTER TABLE public.up_users_role_lnk ;

--
-- Name: up_users_role_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.up_users_role_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.up_users_role_lnk_id_seq ;

--
-- Name: up_users_role_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.up_users_role_lnk_id_seq OWNED BY public.up_users_role_lnk.id;


--
-- Name: upload_folders; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.upload_folders (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    path_id integer,
    path character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.upload_folders ;

--
-- Name: upload_folders_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.upload_folders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.upload_folders_id_seq ;

--
-- Name: upload_folders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.upload_folders_id_seq OWNED BY public.upload_folders.id;


--
-- Name: upload_folders_parent_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.upload_folders_parent_lnk (
    id integer NOT NULL,
    folder_id integer,
    inv_folder_id integer,
    folder_ord double precision
);


ALTER TABLE public.upload_folders_parent_lnk ;

--
-- Name: upload_folders_parent_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.upload_folders_parent_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.upload_folders_parent_lnk_id_seq ;

--
-- Name: upload_folders_parent_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.upload_folders_parent_lnk_id_seq OWNED BY public.upload_folders_parent_lnk.id;


--
-- Name: vip_orders; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.vip_orders (
    id integer NOT NULL,
    document_id character varying(255),
    order_code character varying(255),
    amount integer,
    duration_days integer,
    status character varying(255),
    paid_at timestamp(6) without time zone,
    sepay_transaction_id character varying(255),
    sepay_reference character varying(255),
    note text,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.vip_orders ;

--
-- Name: vip_orders_buyer_lnk; Type: TABLE; Schema: public; Owner: sitruyen
--

CREATE TABLE public.vip_orders_buyer_lnk (
    id integer NOT NULL,
    vip_order_id integer,
    user_id integer
);


ALTER TABLE public.vip_orders_buyer_lnk ;

--
-- Name: vip_orders_buyer_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.vip_orders_buyer_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vip_orders_buyer_lnk_id_seq ;

--
-- Name: vip_orders_buyer_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.vip_orders_buyer_lnk_id_seq OWNED BY public.vip_orders_buyer_lnk.id;


--
-- Name: vip_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: sitruyen
--

CREATE SEQUENCE public.vip_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vip_orders_id_seq ;

--
-- Name: vip_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sitruyen
--

ALTER SEQUENCE public.vip_orders_id_seq OWNED BY public.vip_orders.id;


--
-- Name: admin_permissions id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_permissions ALTER COLUMN id SET DEFAULT nextval('public.admin_permissions_id_seq'::regclass);


--
-- Name: admin_permissions_role_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_permissions_role_lnk ALTER COLUMN id SET DEFAULT nextval('public.admin_permissions_role_lnk_id_seq'::regclass);


--
-- Name: admin_roles id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_roles ALTER COLUMN id SET DEFAULT nextval('public.admin_roles_id_seq'::regclass);


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: admin_users_roles_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_users_roles_lnk ALTER COLUMN id SET DEFAULT nextval('public.admin_users_roles_lnk_id_seq'::regclass);


--
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: categories_stories_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.categories_stories_lnk ALTER COLUMN id SET DEFAULT nextval('public.categories_stories_lnk_id_seq'::regclass);


--
-- Name: chapters id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.chapters ALTER COLUMN id SET DEFAULT nextval('public.chapters_id_seq'::regclass);


--
-- Name: chapters_story_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.chapters_story_lnk ALTER COLUMN id SET DEFAULT nextval('public.chapters_story_lnk_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: comments_chapter_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_chapter_lnk ALTER COLUMN id SET DEFAULT nextval('public.comments_chapter_lnk_id_seq'::regclass);


--
-- Name: comments_parent_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_parent_lnk ALTER COLUMN id SET DEFAULT nextval('public.comments_parent_lnk_id_seq'::regclass);


--
-- Name: comments_sticker_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_sticker_lnk ALTER COLUMN id SET DEFAULT nextval('public.comments_sticker_lnk_id_seq'::regclass);


--
-- Name: comments_story_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_story_lnk ALTER COLUMN id SET DEFAULT nextval('public.comments_story_lnk_id_seq'::regclass);


--
-- Name: comments_user_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_user_lnk ALTER COLUMN id SET DEFAULT nextval('public.comments_user_lnk_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: files_folder_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files_folder_lnk ALTER COLUMN id SET DEFAULT nextval('public.files_folder_lnk_id_seq'::regclass);


--
-- Name: files_related_mph id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files_related_mph ALTER COLUMN id SET DEFAULT nextval('public.files_related_mph_id_seq'::regclass);


--
-- Name: follows id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows ALTER COLUMN id SET DEFAULT nextval('public.follows_id_seq'::regclass);


--
-- Name: follows_story_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows_story_lnk ALTER COLUMN id SET DEFAULT nextval('public.follows_story_lnk_id_seq'::regclass);


--
-- Name: follows_user_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows_user_lnk ALTER COLUMN id SET DEFAULT nextval('public.follows_user_lnk_id_seq'::regclass);


--
-- Name: i18n_locale id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.i18n_locale ALTER COLUMN id SET DEFAULT nextval('public.i18n_locale_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: ratings_story_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings_story_lnk ALTER COLUMN id SET DEFAULT nextval('public.ratings_story_lnk_id_seq'::regclass);


--
-- Name: ratings_user_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings_user_lnk ALTER COLUMN id SET DEFAULT nextval('public.ratings_user_lnk_id_seq'::regclass);


--
-- Name: reading-histories id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public."reading-histories" ALTER COLUMN id SET DEFAULT nextval('public."reading-histories_id_seq"'::regclass);


--
-- Name: reading_histories_chapter_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_chapter_lnk ALTER COLUMN id SET DEFAULT nextval('public.reading_histories_chapter_lnk_id_seq'::regclass);


--
-- Name: reading_histories_story_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_story_lnk ALTER COLUMN id SET DEFAULT nextval('public.reading_histories_story_lnk_id_seq'::regclass);


--
-- Name: reading_histories_user_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_user_lnk ALTER COLUMN id SET DEFAULT nextval('public.reading_histories_user_lnk_id_seq'::regclass);


--
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- Name: reports_reporter_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reports_reporter_lnk ALTER COLUMN id SET DEFAULT nextval('public.reports_reporter_lnk_id_seq'::regclass);


--
-- Name: sticker_packs id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.sticker_packs ALTER COLUMN id SET DEFAULT nextval('public.sticker_packs_id_seq'::regclass);


--
-- Name: stickers id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stickers ALTER COLUMN id SET DEFAULT nextval('public.stickers_id_seq'::regclass);


--
-- Name: stickers_pack_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stickers_pack_lnk ALTER COLUMN id SET DEFAULT nextval('public.stickers_pack_lnk_id_seq'::regclass);


--
-- Name: stories id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stories ALTER COLUMN id SET DEFAULT nextval('public.stories_id_seq'::regclass);


--
-- Name: stories_author_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stories_author_lnk ALTER COLUMN id SET DEFAULT nextval('public.stories_author_lnk_id_seq'::regclass);


--
-- Name: strapi_ai_localization_jobs id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_ai_localization_jobs ALTER COLUMN id SET DEFAULT nextval('public.strapi_ai_localization_jobs_id_seq'::regclass);


--
-- Name: strapi_ai_metadata_jobs id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_ai_metadata_jobs ALTER COLUMN id SET DEFAULT nextval('public.strapi_ai_metadata_jobs_id_seq'::regclass);


--
-- Name: strapi_api_token_permissions id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_token_permissions ALTER COLUMN id SET DEFAULT nextval('public.strapi_api_token_permissions_id_seq'::regclass);


--
-- Name: strapi_api_token_permissions_token_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_token_permissions_token_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_api_token_permissions_token_lnk_id_seq'::regclass);


--
-- Name: strapi_api_tokens id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_tokens ALTER COLUMN id SET DEFAULT nextval('public.strapi_api_tokens_id_seq'::regclass);


--
-- Name: strapi_core_store_settings id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_core_store_settings ALTER COLUMN id SET DEFAULT nextval('public.strapi_core_store_settings_id_seq'::regclass);


--
-- Name: strapi_database_schema id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_database_schema ALTER COLUMN id SET DEFAULT nextval('public.strapi_database_schema_id_seq'::regclass);


--
-- Name: strapi_history_versions id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_history_versions ALTER COLUMN id SET DEFAULT nextval('public.strapi_history_versions_id_seq'::regclass);


--
-- Name: strapi_migrations id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_migrations ALTER COLUMN id SET DEFAULT nextval('public.strapi_migrations_id_seq'::regclass);


--
-- Name: strapi_migrations_internal id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_migrations_internal ALTER COLUMN id SET DEFAULT nextval('public.strapi_migrations_internal_id_seq'::regclass);


--
-- Name: strapi_release_actions id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_release_actions ALTER COLUMN id SET DEFAULT nextval('public.strapi_release_actions_id_seq'::regclass);


--
-- Name: strapi_release_actions_release_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_release_actions_release_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_release_actions_release_lnk_id_seq'::regclass);


--
-- Name: strapi_releases id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_releases ALTER COLUMN id SET DEFAULT nextval('public.strapi_releases_id_seq'::regclass);


--
-- Name: strapi_sessions id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_sessions ALTER COLUMN id SET DEFAULT nextval('public.strapi_sessions_id_seq'::regclass);


--
-- Name: strapi_transfer_token_permissions id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions ALTER COLUMN id SET DEFAULT nextval('public.strapi_transfer_token_permissions_id_seq'::regclass);


--
-- Name: strapi_transfer_token_permissions_token_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions_token_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_transfer_token_permissions_token_lnk_id_seq'::regclass);


--
-- Name: strapi_transfer_tokens id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_tokens ALTER COLUMN id SET DEFAULT nextval('public.strapi_transfer_tokens_id_seq'::regclass);


--
-- Name: strapi_webhooks id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_webhooks ALTER COLUMN id SET DEFAULT nextval('public.strapi_webhooks_id_seq'::regclass);


--
-- Name: strapi_workflows id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows ALTER COLUMN id SET DEFAULT nextval('public.strapi_workflows_id_seq'::regclass);


--
-- Name: strapi_workflows_stage_required_to_publish_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stage_required_to_publish_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_workflows_stage_required_to_publish_lnk_id_seq'::regclass);


--
-- Name: strapi_workflows_stages id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages ALTER COLUMN id SET DEFAULT nextval('public.strapi_workflows_stages_id_seq'::regclass);


--
-- Name: strapi_workflows_stages_permissions_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages_permissions_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_workflows_stages_permissions_lnk_id_seq'::regclass);


--
-- Name: strapi_workflows_stages_workflow_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages_workflow_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_workflows_stages_workflow_lnk_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: up_permissions id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_permissions ALTER COLUMN id SET DEFAULT nextval('public.up_permissions_id_seq'::regclass);


--
-- Name: up_permissions_role_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_permissions_role_lnk ALTER COLUMN id SET DEFAULT nextval('public.up_permissions_role_lnk_id_seq'::regclass);


--
-- Name: up_roles id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_roles ALTER COLUMN id SET DEFAULT nextval('public.up_roles_id_seq'::regclass);


--
-- Name: up_users id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_users ALTER COLUMN id SET DEFAULT nextval('public.up_users_id_seq'::regclass);


--
-- Name: up_users_role_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_users_role_lnk ALTER COLUMN id SET DEFAULT nextval('public.up_users_role_lnk_id_seq'::regclass);


--
-- Name: upload_folders id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.upload_folders ALTER COLUMN id SET DEFAULT nextval('public.upload_folders_id_seq'::regclass);


--
-- Name: upload_folders_parent_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.upload_folders_parent_lnk ALTER COLUMN id SET DEFAULT nextval('public.upload_folders_parent_lnk_id_seq'::regclass);


--
-- Name: vip_orders id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.vip_orders ALTER COLUMN id SET DEFAULT nextval('public.vip_orders_id_seq'::regclass);


--
-- Name: vip_orders_buyer_lnk id; Type: DEFAULT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.vip_orders_buyer_lnk ALTER COLUMN id SET DEFAULT nextval('public.vip_orders_buyer_lnk_id_seq'::regclass);


--
-- Name: admin_permissions admin_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_pkey PRIMARY KEY (id);


--
-- Name: admin_permissions_role_lnk admin_permissions_role_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_permissions_role_lnk
    ADD CONSTRAINT admin_permissions_role_lnk_pkey PRIMARY KEY (id);


--
-- Name: admin_permissions_role_lnk admin_permissions_role_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_permissions_role_lnk
    ADD CONSTRAINT admin_permissions_role_lnk_uq UNIQUE (permission_id, role_id);


--
-- Name: admin_roles admin_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: admin_users_roles_lnk admin_users_roles_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_users_roles_lnk
    ADD CONSTRAINT admin_users_roles_lnk_pkey PRIMARY KEY (id);


--
-- Name: admin_users_roles_lnk admin_users_roles_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_users_roles_lnk
    ADD CONSTRAINT admin_users_roles_lnk_uq UNIQUE (user_id, role_id);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories_stories_lnk categories_stories_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.categories_stories_lnk
    ADD CONSTRAINT categories_stories_lnk_pkey PRIMARY KEY (id);


--
-- Name: categories_stories_lnk categories_stories_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.categories_stories_lnk
    ADD CONSTRAINT categories_stories_lnk_uq UNIQUE (category_id, story_id);


--
-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);


--
-- Name: chapters_story_lnk chapters_story_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.chapters_story_lnk
    ADD CONSTRAINT chapters_story_lnk_pkey PRIMARY KEY (id);


--
-- Name: chapters_story_lnk chapters_story_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.chapters_story_lnk
    ADD CONSTRAINT chapters_story_lnk_uq UNIQUE (chapter_id, story_id);


--
-- Name: comments_chapter_lnk comments_chapter_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_chapter_lnk
    ADD CONSTRAINT comments_chapter_lnk_pkey PRIMARY KEY (id);


--
-- Name: comments_chapter_lnk comments_chapter_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_chapter_lnk
    ADD CONSTRAINT comments_chapter_lnk_uq UNIQUE (comment_id, chapter_id);


--
-- Name: comments_parent_lnk comments_parent_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_parent_lnk
    ADD CONSTRAINT comments_parent_lnk_pkey PRIMARY KEY (id);


--
-- Name: comments_parent_lnk comments_parent_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_parent_lnk
    ADD CONSTRAINT comments_parent_lnk_uq UNIQUE (comment_id, inv_comment_id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: comments_sticker_lnk comments_sticker_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_sticker_lnk
    ADD CONSTRAINT comments_sticker_lnk_pkey PRIMARY KEY (id);


--
-- Name: comments_sticker_lnk comments_sticker_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_sticker_lnk
    ADD CONSTRAINT comments_sticker_lnk_uq UNIQUE (comment_id, sticker_id);


--
-- Name: comments_story_lnk comments_story_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_story_lnk
    ADD CONSTRAINT comments_story_lnk_pkey PRIMARY KEY (id);


--
-- Name: comments_story_lnk comments_story_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_story_lnk
    ADD CONSTRAINT comments_story_lnk_uq UNIQUE (comment_id, story_id);


--
-- Name: comments_user_lnk comments_user_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_user_lnk
    ADD CONSTRAINT comments_user_lnk_pkey PRIMARY KEY (id);


--
-- Name: comments_user_lnk comments_user_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_user_lnk
    ADD CONSTRAINT comments_user_lnk_uq UNIQUE (comment_id, user_id);


--
-- Name: files_folder_lnk files_folder_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files_folder_lnk
    ADD CONSTRAINT files_folder_lnk_pkey PRIMARY KEY (id);


--
-- Name: files_folder_lnk files_folder_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files_folder_lnk
    ADD CONSTRAINT files_folder_lnk_uq UNIQUE (file_id, folder_id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: files_related_mph files_related_mph_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files_related_mph
    ADD CONSTRAINT files_related_mph_pkey PRIMARY KEY (id);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (id);


--
-- Name: follows_story_lnk follows_story_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows_story_lnk
    ADD CONSTRAINT follows_story_lnk_pkey PRIMARY KEY (id);


--
-- Name: follows_story_lnk follows_story_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows_story_lnk
    ADD CONSTRAINT follows_story_lnk_uq UNIQUE (follow_id, story_id);


--
-- Name: follows_user_lnk follows_user_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows_user_lnk
    ADD CONSTRAINT follows_user_lnk_pkey PRIMARY KEY (id);


--
-- Name: follows_user_lnk follows_user_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows_user_lnk
    ADD CONSTRAINT follows_user_lnk_uq UNIQUE (follow_id, user_id);


--
-- Name: i18n_locale i18n_locale_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.i18n_locale
    ADD CONSTRAINT i18n_locale_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: ratings_story_lnk ratings_story_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings_story_lnk
    ADD CONSTRAINT ratings_story_lnk_pkey PRIMARY KEY (id);


--
-- Name: ratings_story_lnk ratings_story_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings_story_lnk
    ADD CONSTRAINT ratings_story_lnk_uq UNIQUE (rating_id, story_id);


--
-- Name: ratings_user_lnk ratings_user_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings_user_lnk
    ADD CONSTRAINT ratings_user_lnk_pkey PRIMARY KEY (id);


--
-- Name: ratings_user_lnk ratings_user_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings_user_lnk
    ADD CONSTRAINT ratings_user_lnk_uq UNIQUE (rating_id, user_id);


--
-- Name: reading-histories reading-histories_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public."reading-histories"
    ADD CONSTRAINT "reading-histories_pkey" PRIMARY KEY (id);


--
-- Name: reading_histories_chapter_lnk reading_histories_chapter_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_chapter_lnk
    ADD CONSTRAINT reading_histories_chapter_lnk_pkey PRIMARY KEY (id);


--
-- Name: reading_histories_chapter_lnk reading_histories_chapter_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_chapter_lnk
    ADD CONSTRAINT reading_histories_chapter_lnk_uq UNIQUE (reading_history_id, chapter_id);


--
-- Name: reading_histories_story_lnk reading_histories_story_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_story_lnk
    ADD CONSTRAINT reading_histories_story_lnk_pkey PRIMARY KEY (id);


--
-- Name: reading_histories_story_lnk reading_histories_story_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_story_lnk
    ADD CONSTRAINT reading_histories_story_lnk_uq UNIQUE (reading_history_id, story_id);


--
-- Name: reading_histories_user_lnk reading_histories_user_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_user_lnk
    ADD CONSTRAINT reading_histories_user_lnk_pkey PRIMARY KEY (id);


--
-- Name: reading_histories_user_lnk reading_histories_user_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_user_lnk
    ADD CONSTRAINT reading_histories_user_lnk_uq UNIQUE (reading_history_id, user_id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: reports_reporter_lnk reports_reporter_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reports_reporter_lnk
    ADD CONSTRAINT reports_reporter_lnk_pkey PRIMARY KEY (id);


--
-- Name: reports_reporter_lnk reports_reporter_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reports_reporter_lnk
    ADD CONSTRAINT reports_reporter_lnk_uq UNIQUE (report_id, user_id);


--
-- Name: sticker_packs sticker_packs_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.sticker_packs
    ADD CONSTRAINT sticker_packs_pkey PRIMARY KEY (id);


--
-- Name: stickers_pack_lnk stickers_pack_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stickers_pack_lnk
    ADD CONSTRAINT stickers_pack_lnk_pkey PRIMARY KEY (id);


--
-- Name: stickers_pack_lnk stickers_pack_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stickers_pack_lnk
    ADD CONSTRAINT stickers_pack_lnk_uq UNIQUE (sticker_id, sticker_pack_id);


--
-- Name: stickers stickers_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stickers
    ADD CONSTRAINT stickers_pkey PRIMARY KEY (id);


--
-- Name: stories_author_lnk stories_author_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stories_author_lnk
    ADD CONSTRAINT stories_author_lnk_pkey PRIMARY KEY (id);


--
-- Name: stories_author_lnk stories_author_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stories_author_lnk
    ADD CONSTRAINT stories_author_lnk_uq UNIQUE (story_id, author_id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: strapi_ai_localization_jobs strapi_ai_localization_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_ai_localization_jobs
    ADD CONSTRAINT strapi_ai_localization_jobs_pkey PRIMARY KEY (id);


--
-- Name: strapi_ai_metadata_jobs strapi_ai_metadata_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_ai_metadata_jobs
    ADD CONSTRAINT strapi_ai_metadata_jobs_pkey PRIMARY KEY (id);


--
-- Name: strapi_api_token_permissions strapi_api_token_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_token_permissions
    ADD CONSTRAINT strapi_api_token_permissions_pkey PRIMARY KEY (id);


--
-- Name: strapi_api_token_permissions_token_lnk strapi_api_token_permissions_token_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_token_permissions_token_lnk
    ADD CONSTRAINT strapi_api_token_permissions_token_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_api_token_permissions_token_lnk strapi_api_token_permissions_token_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_token_permissions_token_lnk
    ADD CONSTRAINT strapi_api_token_permissions_token_lnk_uq UNIQUE (api_token_permission_id, api_token_id);


--
-- Name: strapi_api_tokens strapi_api_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_pkey PRIMARY KEY (id);


--
-- Name: strapi_core_store_settings strapi_core_store_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_core_store_settings
    ADD CONSTRAINT strapi_core_store_settings_pkey PRIMARY KEY (id);


--
-- Name: strapi_database_schema strapi_database_schema_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_database_schema
    ADD CONSTRAINT strapi_database_schema_pkey PRIMARY KEY (id);


--
-- Name: strapi_history_versions strapi_history_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_history_versions
    ADD CONSTRAINT strapi_history_versions_pkey PRIMARY KEY (id);


--
-- Name: strapi_migrations_internal strapi_migrations_internal_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_migrations_internal
    ADD CONSTRAINT strapi_migrations_internal_pkey PRIMARY KEY (id);


--
-- Name: strapi_migrations strapi_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_migrations
    ADD CONSTRAINT strapi_migrations_pkey PRIMARY KEY (id);


--
-- Name: strapi_release_actions strapi_release_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_release_actions
    ADD CONSTRAINT strapi_release_actions_pkey PRIMARY KEY (id);


--
-- Name: strapi_release_actions_release_lnk strapi_release_actions_release_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_release_actions_release_lnk
    ADD CONSTRAINT strapi_release_actions_release_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_release_actions_release_lnk strapi_release_actions_release_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_release_actions_release_lnk
    ADD CONSTRAINT strapi_release_actions_release_lnk_uq UNIQUE (release_action_id, release_id);


--
-- Name: strapi_releases strapi_releases_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_releases
    ADD CONSTRAINT strapi_releases_pkey PRIMARY KEY (id);


--
-- Name: strapi_sessions strapi_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_sessions
    ADD CONSTRAINT strapi_sessions_pkey PRIMARY KEY (id);


--
-- Name: strapi_transfer_token_permissions strapi_transfer_token_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions
    ADD CONSTRAINT strapi_transfer_token_permissions_pkey PRIMARY KEY (id);


--
-- Name: strapi_transfer_token_permissions_token_lnk strapi_transfer_token_permissions_token_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions_token_lnk
    ADD CONSTRAINT strapi_transfer_token_permissions_token_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_transfer_token_permissions_token_lnk strapi_transfer_token_permissions_token_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions_token_lnk
    ADD CONSTRAINT strapi_transfer_token_permissions_token_lnk_uq UNIQUE (transfer_token_permission_id, transfer_token_id);


--
-- Name: strapi_transfer_tokens strapi_transfer_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_tokens
    ADD CONSTRAINT strapi_transfer_tokens_pkey PRIMARY KEY (id);


--
-- Name: strapi_webhooks strapi_webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_webhooks
    ADD CONSTRAINT strapi_webhooks_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows strapi_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows
    ADD CONSTRAINT strapi_workflows_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows_stage_required_to_publish_lnk strapi_workflows_stage_required_to_publish_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stage_required_to_publish_lnk
    ADD CONSTRAINT strapi_workflows_stage_required_to_publish_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows_stage_required_to_publish_lnk strapi_workflows_stage_required_to_publish_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stage_required_to_publish_lnk
    ADD CONSTRAINT strapi_workflows_stage_required_to_publish_lnk_uq UNIQUE (workflow_id, workflow_stage_id);


--
-- Name: strapi_workflows_stages_permissions_lnk strapi_workflows_stages_permissions_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages_permissions_lnk
    ADD CONSTRAINT strapi_workflows_stages_permissions_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows_stages_permissions_lnk strapi_workflows_stages_permissions_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages_permissions_lnk
    ADD CONSTRAINT strapi_workflows_stages_permissions_lnk_uq UNIQUE (workflow_stage_id, permission_id);


--
-- Name: strapi_workflows_stages strapi_workflows_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages
    ADD CONSTRAINT strapi_workflows_stages_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows_stages_workflow_lnk strapi_workflows_stages_workflow_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages_workflow_lnk
    ADD CONSTRAINT strapi_workflows_stages_workflow_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows_stages_workflow_lnk strapi_workflows_stages_workflow_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages_workflow_lnk
    ADD CONSTRAINT strapi_workflows_stages_workflow_lnk_uq UNIQUE (workflow_stage_id, workflow_id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: up_permissions up_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_pkey PRIMARY KEY (id);


--
-- Name: up_permissions_role_lnk up_permissions_role_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_permissions_role_lnk
    ADD CONSTRAINT up_permissions_role_lnk_pkey PRIMARY KEY (id);


--
-- Name: up_permissions_role_lnk up_permissions_role_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_permissions_role_lnk
    ADD CONSTRAINT up_permissions_role_lnk_uq UNIQUE (permission_id, role_id);


--
-- Name: up_roles up_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_pkey PRIMARY KEY (id);


--
-- Name: up_users up_users_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_pkey PRIMARY KEY (id);


--
-- Name: up_users_role_lnk up_users_role_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_users_role_lnk
    ADD CONSTRAINT up_users_role_lnk_pkey PRIMARY KEY (id);


--
-- Name: up_users_role_lnk up_users_role_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_users_role_lnk
    ADD CONSTRAINT up_users_role_lnk_uq UNIQUE (user_id, role_id);


--
-- Name: upload_folders_parent_lnk upload_folders_parent_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.upload_folders_parent_lnk
    ADD CONSTRAINT upload_folders_parent_lnk_pkey PRIMARY KEY (id);


--
-- Name: upload_folders_parent_lnk upload_folders_parent_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.upload_folders_parent_lnk
    ADD CONSTRAINT upload_folders_parent_lnk_uq UNIQUE (folder_id, inv_folder_id);


--
-- Name: upload_folders upload_folders_path_id_index; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_path_id_index UNIQUE (path_id);


--
-- Name: upload_folders upload_folders_path_index; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_path_index UNIQUE (path);


--
-- Name: upload_folders upload_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_pkey PRIMARY KEY (id);


--
-- Name: vip_orders_buyer_lnk vip_orders_buyer_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.vip_orders_buyer_lnk
    ADD CONSTRAINT vip_orders_buyer_lnk_pkey PRIMARY KEY (id);


--
-- Name: vip_orders_buyer_lnk vip_orders_buyer_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.vip_orders_buyer_lnk
    ADD CONSTRAINT vip_orders_buyer_lnk_uq UNIQUE (vip_order_id, user_id);


--
-- Name: vip_orders vip_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.vip_orders
    ADD CONSTRAINT vip_orders_pkey PRIMARY KEY (id);


--
-- Name: admin_permissions_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_permissions_created_by_id_fk ON public.admin_permissions USING btree (created_by_id);


--
-- Name: admin_permissions_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_permissions_documents_idx ON public.admin_permissions USING btree (document_id, locale, published_at);


--
-- Name: admin_permissions_role_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_permissions_role_lnk_fk ON public.admin_permissions_role_lnk USING btree (permission_id);


--
-- Name: admin_permissions_role_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_permissions_role_lnk_ifk ON public.admin_permissions_role_lnk USING btree (role_id);


--
-- Name: admin_permissions_role_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_permissions_role_lnk_oifk ON public.admin_permissions_role_lnk USING btree (permission_ord);


--
-- Name: admin_permissions_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_permissions_updated_by_id_fk ON public.admin_permissions USING btree (updated_by_id);


--
-- Name: admin_roles_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_roles_created_by_id_fk ON public.admin_roles USING btree (created_by_id);


--
-- Name: admin_roles_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_roles_documents_idx ON public.admin_roles USING btree (document_id, locale, published_at);


--
-- Name: admin_roles_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_roles_updated_by_id_fk ON public.admin_roles USING btree (updated_by_id);


--
-- Name: admin_users_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_users_created_by_id_fk ON public.admin_users USING btree (created_by_id);


--
-- Name: admin_users_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_users_documents_idx ON public.admin_users USING btree (document_id, locale, published_at);


--
-- Name: admin_users_roles_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_users_roles_lnk_fk ON public.admin_users_roles_lnk USING btree (user_id);


--
-- Name: admin_users_roles_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_users_roles_lnk_ifk ON public.admin_users_roles_lnk USING btree (role_id);


--
-- Name: admin_users_roles_lnk_ofk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_users_roles_lnk_ofk ON public.admin_users_roles_lnk USING btree (role_ord);


--
-- Name: admin_users_roles_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_users_roles_lnk_oifk ON public.admin_users_roles_lnk USING btree (user_ord);


--
-- Name: admin_users_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX admin_users_updated_by_id_fk ON public.admin_users USING btree (updated_by_id);


--
-- Name: authors_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX authors_created_by_id_fk ON public.authors USING btree (created_by_id);


--
-- Name: authors_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX authors_documents_idx ON public.authors USING btree (document_id, locale, published_at);


--
-- Name: authors_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX authors_updated_by_id_fk ON public.authors USING btree (updated_by_id);


--
-- Name: categories_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX categories_created_by_id_fk ON public.categories USING btree (created_by_id);


--
-- Name: categories_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX categories_documents_idx ON public.categories USING btree (document_id, locale, published_at);


--
-- Name: categories_stories_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX categories_stories_lnk_fk ON public.categories_stories_lnk USING btree (category_id);


--
-- Name: categories_stories_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX categories_stories_lnk_ifk ON public.categories_stories_lnk USING btree (story_id);


--
-- Name: categories_stories_lnk_ofk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX categories_stories_lnk_ofk ON public.categories_stories_lnk USING btree (story_ord);


--
-- Name: categories_stories_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX categories_stories_lnk_oifk ON public.categories_stories_lnk USING btree (category_ord);


--
-- Name: categories_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX categories_updated_by_id_fk ON public.categories USING btree (updated_by_id);


--
-- Name: chapters_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX chapters_created_by_id_fk ON public.chapters USING btree (created_by_id);


--
-- Name: chapters_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX chapters_documents_idx ON public.chapters USING btree (document_id, locale, published_at);


--
-- Name: chapters_story_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX chapters_story_lnk_fk ON public.chapters_story_lnk USING btree (chapter_id);


--
-- Name: chapters_story_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX chapters_story_lnk_ifk ON public.chapters_story_lnk USING btree (story_id);


--
-- Name: chapters_story_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX chapters_story_lnk_oifk ON public.chapters_story_lnk USING btree (chapter_ord);


--
-- Name: chapters_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX chapters_updated_by_id_fk ON public.chapters USING btree (updated_by_id);


--
-- Name: comments_chapter_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_chapter_lnk_fk ON public.comments_chapter_lnk USING btree (comment_id);


--
-- Name: comments_chapter_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_chapter_lnk_ifk ON public.comments_chapter_lnk USING btree (chapter_id);


--
-- Name: comments_chapter_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_chapter_lnk_oifk ON public.comments_chapter_lnk USING btree (comment_ord);


--
-- Name: comments_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_created_by_id_fk ON public.comments USING btree (created_by_id);


--
-- Name: comments_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_documents_idx ON public.comments USING btree (document_id, locale, published_at);


--
-- Name: comments_parent_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_parent_lnk_fk ON public.comments_parent_lnk USING btree (comment_id);


--
-- Name: comments_parent_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_parent_lnk_ifk ON public.comments_parent_lnk USING btree (inv_comment_id);


--
-- Name: comments_sticker_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_sticker_lnk_fk ON public.comments_sticker_lnk USING btree (comment_id);


--
-- Name: comments_sticker_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_sticker_lnk_ifk ON public.comments_sticker_lnk USING btree (sticker_id);


--
-- Name: comments_story_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_story_lnk_fk ON public.comments_story_lnk USING btree (comment_id);


--
-- Name: comments_story_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_story_lnk_ifk ON public.comments_story_lnk USING btree (story_id);


--
-- Name: comments_story_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_story_lnk_oifk ON public.comments_story_lnk USING btree (comment_ord);


--
-- Name: comments_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_updated_by_id_fk ON public.comments USING btree (updated_by_id);


--
-- Name: comments_user_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_user_lnk_fk ON public.comments_user_lnk USING btree (comment_id);


--
-- Name: comments_user_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_user_lnk_ifk ON public.comments_user_lnk USING btree (user_id);


--
-- Name: comments_user_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX comments_user_lnk_oifk ON public.comments_user_lnk USING btree (comment_ord);


--
-- Name: files_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX files_created_by_id_fk ON public.files USING btree (created_by_id);


--
-- Name: files_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX files_documents_idx ON public.files USING btree (document_id, locale, published_at);


--
-- Name: files_folder_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX files_folder_lnk_fk ON public.files_folder_lnk USING btree (file_id);


--
-- Name: files_folder_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX files_folder_lnk_ifk ON public.files_folder_lnk USING btree (folder_id);


--
-- Name: files_folder_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX files_folder_lnk_oifk ON public.files_folder_lnk USING btree (file_ord);


--
-- Name: files_related_mph_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX files_related_mph_fk ON public.files_related_mph USING btree (file_id);


--
-- Name: files_related_mph_idix; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX files_related_mph_idix ON public.files_related_mph USING btree (related_id);


--
-- Name: files_related_mph_oidx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX files_related_mph_oidx ON public.files_related_mph USING btree ("order");


--
-- Name: files_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX files_updated_by_id_fk ON public.files USING btree (updated_by_id);


--
-- Name: follows_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX follows_created_by_id_fk ON public.follows USING btree (created_by_id);


--
-- Name: follows_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX follows_documents_idx ON public.follows USING btree (document_id, locale, published_at);


--
-- Name: follows_story_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX follows_story_lnk_fk ON public.follows_story_lnk USING btree (follow_id);


--
-- Name: follows_story_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX follows_story_lnk_ifk ON public.follows_story_lnk USING btree (story_id);


--
-- Name: follows_story_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX follows_story_lnk_oifk ON public.follows_story_lnk USING btree (follow_ord);


--
-- Name: follows_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX follows_updated_by_id_fk ON public.follows USING btree (updated_by_id);


--
-- Name: follows_user_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX follows_user_lnk_fk ON public.follows_user_lnk USING btree (follow_id);


--
-- Name: follows_user_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX follows_user_lnk_ifk ON public.follows_user_lnk USING btree (user_id);


--
-- Name: follows_user_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX follows_user_lnk_oifk ON public.follows_user_lnk USING btree (follow_ord);


--
-- Name: i18n_locale_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX i18n_locale_created_by_id_fk ON public.i18n_locale USING btree (created_by_id);


--
-- Name: i18n_locale_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX i18n_locale_documents_idx ON public.i18n_locale USING btree (document_id, locale, published_at);


--
-- Name: i18n_locale_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX i18n_locale_updated_by_id_fk ON public.i18n_locale USING btree (updated_by_id);


--
-- Name: ratings_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX ratings_created_by_id_fk ON public.ratings USING btree (created_by_id);


--
-- Name: ratings_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX ratings_documents_idx ON public.ratings USING btree (document_id, locale, published_at);


--
-- Name: ratings_story_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX ratings_story_lnk_fk ON public.ratings_story_lnk USING btree (rating_id);


--
-- Name: ratings_story_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX ratings_story_lnk_ifk ON public.ratings_story_lnk USING btree (story_id);


--
-- Name: ratings_story_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX ratings_story_lnk_oifk ON public.ratings_story_lnk USING btree (rating_ord);


--
-- Name: ratings_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX ratings_updated_by_id_fk ON public.ratings USING btree (updated_by_id);


--
-- Name: ratings_user_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX ratings_user_lnk_fk ON public.ratings_user_lnk USING btree (rating_id);


--
-- Name: ratings_user_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX ratings_user_lnk_ifk ON public.ratings_user_lnk USING btree (user_id);


--
-- Name: ratings_user_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX ratings_user_lnk_oifk ON public.ratings_user_lnk USING btree (rating_ord);


--
-- Name: reading-histories_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX "reading-histories_created_by_id_fk" ON public."reading-histories" USING btree (created_by_id);


--
-- Name: reading-histories_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX "reading-histories_documents_idx" ON public."reading-histories" USING btree (document_id, locale, published_at);


--
-- Name: reading-histories_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX "reading-histories_updated_by_id_fk" ON public."reading-histories" USING btree (updated_by_id);


--
-- Name: reading_histories_chapter_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reading_histories_chapter_lnk_fk ON public.reading_histories_chapter_lnk USING btree (reading_history_id);


--
-- Name: reading_histories_chapter_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reading_histories_chapter_lnk_ifk ON public.reading_histories_chapter_lnk USING btree (chapter_id);


--
-- Name: reading_histories_chapter_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reading_histories_chapter_lnk_oifk ON public.reading_histories_chapter_lnk USING btree (reading_history_ord);


--
-- Name: reading_histories_story_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reading_histories_story_lnk_fk ON public.reading_histories_story_lnk USING btree (reading_history_id);


--
-- Name: reading_histories_story_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reading_histories_story_lnk_ifk ON public.reading_histories_story_lnk USING btree (story_id);


--
-- Name: reading_histories_story_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reading_histories_story_lnk_oifk ON public.reading_histories_story_lnk USING btree (reading_history_ord);


--
-- Name: reading_histories_user_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reading_histories_user_lnk_fk ON public.reading_histories_user_lnk USING btree (reading_history_id);


--
-- Name: reading_histories_user_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reading_histories_user_lnk_ifk ON public.reading_histories_user_lnk USING btree (user_id);


--
-- Name: reading_histories_user_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reading_histories_user_lnk_oifk ON public.reading_histories_user_lnk USING btree (reading_history_ord);


--
-- Name: reports_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reports_created_by_id_fk ON public.reports USING btree (created_by_id);


--
-- Name: reports_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reports_documents_idx ON public.reports USING btree (document_id, locale, published_at);


--
-- Name: reports_reporter_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reports_reporter_lnk_fk ON public.reports_reporter_lnk USING btree (report_id);


--
-- Name: reports_reporter_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reports_reporter_lnk_ifk ON public.reports_reporter_lnk USING btree (user_id);


--
-- Name: reports_reporter_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reports_reporter_lnk_oifk ON public.reports_reporter_lnk USING btree (report_ord);


--
-- Name: reports_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX reports_updated_by_id_fk ON public.reports USING btree (updated_by_id);


--
-- Name: sticker_packs_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX sticker_packs_created_by_id_fk ON public.sticker_packs USING btree (created_by_id);


--
-- Name: sticker_packs_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX sticker_packs_documents_idx ON public.sticker_packs USING btree (document_id, locale, published_at);


--
-- Name: sticker_packs_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX sticker_packs_updated_by_id_fk ON public.sticker_packs USING btree (updated_by_id);


--
-- Name: stickers_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stickers_created_by_id_fk ON public.stickers USING btree (created_by_id);


--
-- Name: stickers_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stickers_documents_idx ON public.stickers USING btree (document_id, locale, published_at);


--
-- Name: stickers_pack_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stickers_pack_lnk_fk ON public.stickers_pack_lnk USING btree (sticker_id);


--
-- Name: stickers_pack_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stickers_pack_lnk_ifk ON public.stickers_pack_lnk USING btree (sticker_pack_id);


--
-- Name: stickers_pack_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stickers_pack_lnk_oifk ON public.stickers_pack_lnk USING btree (sticker_ord);


--
-- Name: stickers_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stickers_updated_by_id_fk ON public.stickers USING btree (updated_by_id);


--
-- Name: stories_author_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stories_author_lnk_fk ON public.stories_author_lnk USING btree (story_id);


--
-- Name: stories_author_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stories_author_lnk_ifk ON public.stories_author_lnk USING btree (author_id);


--
-- Name: stories_author_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stories_author_lnk_oifk ON public.stories_author_lnk USING btree (story_ord);


--
-- Name: stories_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stories_created_by_id_fk ON public.stories USING btree (created_by_id);


--
-- Name: stories_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stories_documents_idx ON public.stories USING btree (document_id, locale, published_at);


--
-- Name: stories_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX stories_updated_by_id_fk ON public.stories USING btree (updated_by_id);


--
-- Name: strapi_api_token_permissions_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_api_token_permissions_created_by_id_fk ON public.strapi_api_token_permissions USING btree (created_by_id);


--
-- Name: strapi_api_token_permissions_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_api_token_permissions_documents_idx ON public.strapi_api_token_permissions USING btree (document_id, locale, published_at);


--
-- Name: strapi_api_token_permissions_token_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_api_token_permissions_token_lnk_fk ON public.strapi_api_token_permissions_token_lnk USING btree (api_token_permission_id);


--
-- Name: strapi_api_token_permissions_token_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_api_token_permissions_token_lnk_ifk ON public.strapi_api_token_permissions_token_lnk USING btree (api_token_id);


--
-- Name: strapi_api_token_permissions_token_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_api_token_permissions_token_lnk_oifk ON public.strapi_api_token_permissions_token_lnk USING btree (api_token_permission_ord);


--
-- Name: strapi_api_token_permissions_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_api_token_permissions_updated_by_id_fk ON public.strapi_api_token_permissions USING btree (updated_by_id);


--
-- Name: strapi_api_tokens_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_api_tokens_created_by_id_fk ON public.strapi_api_tokens USING btree (created_by_id);


--
-- Name: strapi_api_tokens_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_api_tokens_documents_idx ON public.strapi_api_tokens USING btree (document_id, locale, published_at);


--
-- Name: strapi_api_tokens_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_api_tokens_updated_by_id_fk ON public.strapi_api_tokens USING btree (updated_by_id);


--
-- Name: strapi_history_versions_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_history_versions_created_by_id_fk ON public.strapi_history_versions USING btree (created_by_id);


--
-- Name: strapi_release_actions_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_release_actions_created_by_id_fk ON public.strapi_release_actions USING btree (created_by_id);


--
-- Name: strapi_release_actions_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_release_actions_documents_idx ON public.strapi_release_actions USING btree (document_id, locale, published_at);


--
-- Name: strapi_release_actions_release_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_release_actions_release_lnk_fk ON public.strapi_release_actions_release_lnk USING btree (release_action_id);


--
-- Name: strapi_release_actions_release_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_release_actions_release_lnk_ifk ON public.strapi_release_actions_release_lnk USING btree (release_id);


--
-- Name: strapi_release_actions_release_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_release_actions_release_lnk_oifk ON public.strapi_release_actions_release_lnk USING btree (release_action_ord);


--
-- Name: strapi_release_actions_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_release_actions_updated_by_id_fk ON public.strapi_release_actions USING btree (updated_by_id);


--
-- Name: strapi_releases_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_releases_created_by_id_fk ON public.strapi_releases USING btree (created_by_id);


--
-- Name: strapi_releases_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_releases_documents_idx ON public.strapi_releases USING btree (document_id, locale, published_at);


--
-- Name: strapi_releases_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_releases_updated_by_id_fk ON public.strapi_releases USING btree (updated_by_id);


--
-- Name: strapi_sessions_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_sessions_created_by_id_fk ON public.strapi_sessions USING btree (created_by_id);


--
-- Name: strapi_sessions_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_sessions_documents_idx ON public.strapi_sessions USING btree (document_id, locale, published_at);


--
-- Name: strapi_sessions_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_sessions_updated_by_id_fk ON public.strapi_sessions USING btree (updated_by_id);


--
-- Name: strapi_transfer_token_permissions_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_transfer_token_permissions_created_by_id_fk ON public.strapi_transfer_token_permissions USING btree (created_by_id);


--
-- Name: strapi_transfer_token_permissions_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_transfer_token_permissions_documents_idx ON public.strapi_transfer_token_permissions USING btree (document_id, locale, published_at);


--
-- Name: strapi_transfer_token_permissions_token_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_transfer_token_permissions_token_lnk_fk ON public.strapi_transfer_token_permissions_token_lnk USING btree (transfer_token_permission_id);


--
-- Name: strapi_transfer_token_permissions_token_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_transfer_token_permissions_token_lnk_ifk ON public.strapi_transfer_token_permissions_token_lnk USING btree (transfer_token_id);


--
-- Name: strapi_transfer_token_permissions_token_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_transfer_token_permissions_token_lnk_oifk ON public.strapi_transfer_token_permissions_token_lnk USING btree (transfer_token_permission_ord);


--
-- Name: strapi_transfer_token_permissions_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_transfer_token_permissions_updated_by_id_fk ON public.strapi_transfer_token_permissions USING btree (updated_by_id);


--
-- Name: strapi_transfer_tokens_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_transfer_tokens_created_by_id_fk ON public.strapi_transfer_tokens USING btree (created_by_id);


--
-- Name: strapi_transfer_tokens_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_transfer_tokens_documents_idx ON public.strapi_transfer_tokens USING btree (document_id, locale, published_at);


--
-- Name: strapi_transfer_tokens_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_transfer_tokens_updated_by_id_fk ON public.strapi_transfer_tokens USING btree (updated_by_id);


--
-- Name: strapi_workflows_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_created_by_id_fk ON public.strapi_workflows USING btree (created_by_id);


--
-- Name: strapi_workflows_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_documents_idx ON public.strapi_workflows USING btree (document_id, locale, published_at);


--
-- Name: strapi_workflows_stage_required_to_publish_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_stage_required_to_publish_lnk_fk ON public.strapi_workflows_stage_required_to_publish_lnk USING btree (workflow_id);


--
-- Name: strapi_workflows_stage_required_to_publish_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_stage_required_to_publish_lnk_ifk ON public.strapi_workflows_stage_required_to_publish_lnk USING btree (workflow_stage_id);


--
-- Name: strapi_workflows_stages_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_stages_created_by_id_fk ON public.strapi_workflows_stages USING btree (created_by_id);


--
-- Name: strapi_workflows_stages_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_stages_documents_idx ON public.strapi_workflows_stages USING btree (document_id, locale, published_at);


--
-- Name: strapi_workflows_stages_permissions_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_stages_permissions_lnk_fk ON public.strapi_workflows_stages_permissions_lnk USING btree (workflow_stage_id);


--
-- Name: strapi_workflows_stages_permissions_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_stages_permissions_lnk_ifk ON public.strapi_workflows_stages_permissions_lnk USING btree (permission_id);


--
-- Name: strapi_workflows_stages_permissions_lnk_ofk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_stages_permissions_lnk_ofk ON public.strapi_workflows_stages_permissions_lnk USING btree (permission_ord);


--
-- Name: strapi_workflows_stages_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_stages_updated_by_id_fk ON public.strapi_workflows_stages USING btree (updated_by_id);


--
-- Name: strapi_workflows_stages_workflow_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_stages_workflow_lnk_fk ON public.strapi_workflows_stages_workflow_lnk USING btree (workflow_stage_id);


--
-- Name: strapi_workflows_stages_workflow_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_stages_workflow_lnk_ifk ON public.strapi_workflows_stages_workflow_lnk USING btree (workflow_id);


--
-- Name: strapi_workflows_stages_workflow_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_stages_workflow_lnk_oifk ON public.strapi_workflows_stages_workflow_lnk USING btree (workflow_stage_ord);


--
-- Name: strapi_workflows_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX strapi_workflows_updated_by_id_fk ON public.strapi_workflows USING btree (updated_by_id);


--
-- Name: tags_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX tags_created_by_id_fk ON public.tags USING btree (created_by_id);


--
-- Name: tags_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX tags_documents_idx ON public.tags USING btree (document_id, locale, published_at);


--
-- Name: tags_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX tags_updated_by_id_fk ON public.tags USING btree (updated_by_id);


--
-- Name: up_permissions_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_permissions_created_by_id_fk ON public.up_permissions USING btree (created_by_id);


--
-- Name: up_permissions_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_permissions_documents_idx ON public.up_permissions USING btree (document_id, locale, published_at);


--
-- Name: up_permissions_role_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_permissions_role_lnk_fk ON public.up_permissions_role_lnk USING btree (permission_id);


--
-- Name: up_permissions_role_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_permissions_role_lnk_ifk ON public.up_permissions_role_lnk USING btree (role_id);


--
-- Name: up_permissions_role_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_permissions_role_lnk_oifk ON public.up_permissions_role_lnk USING btree (permission_ord);


--
-- Name: up_permissions_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_permissions_updated_by_id_fk ON public.up_permissions USING btree (updated_by_id);


--
-- Name: up_roles_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_roles_created_by_id_fk ON public.up_roles USING btree (created_by_id);


--
-- Name: up_roles_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_roles_documents_idx ON public.up_roles USING btree (document_id, locale, published_at);


--
-- Name: up_roles_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_roles_updated_by_id_fk ON public.up_roles USING btree (updated_by_id);


--
-- Name: up_users_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_users_created_by_id_fk ON public.up_users USING btree (created_by_id);


--
-- Name: up_users_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_users_documents_idx ON public.up_users USING btree (document_id, locale, published_at);


--
-- Name: up_users_role_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_users_role_lnk_fk ON public.up_users_role_lnk USING btree (user_id);


--
-- Name: up_users_role_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_users_role_lnk_ifk ON public.up_users_role_lnk USING btree (role_id);


--
-- Name: up_users_role_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_users_role_lnk_oifk ON public.up_users_role_lnk USING btree (user_ord);


--
-- Name: up_users_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX up_users_updated_by_id_fk ON public.up_users USING btree (updated_by_id);


--
-- Name: upload_files_created_at_index; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_files_created_at_index ON public.files USING btree (created_at);


--
-- Name: upload_files_ext_index; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_files_ext_index ON public.files USING btree (ext);


--
-- Name: upload_files_folder_path_index; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_files_folder_path_index ON public.files USING btree (folder_path);


--
-- Name: upload_files_name_index; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_files_name_index ON public.files USING btree (name);


--
-- Name: upload_files_size_index; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_files_size_index ON public.files USING btree (size);


--
-- Name: upload_files_updated_at_index; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_files_updated_at_index ON public.files USING btree (updated_at);


--
-- Name: upload_folders_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_folders_created_by_id_fk ON public.upload_folders USING btree (created_by_id);


--
-- Name: upload_folders_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_folders_documents_idx ON public.upload_folders USING btree (document_id, locale, published_at);


--
-- Name: upload_folders_parent_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_folders_parent_lnk_fk ON public.upload_folders_parent_lnk USING btree (folder_id);


--
-- Name: upload_folders_parent_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_folders_parent_lnk_ifk ON public.upload_folders_parent_lnk USING btree (inv_folder_id);


--
-- Name: upload_folders_parent_lnk_oifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_folders_parent_lnk_oifk ON public.upload_folders_parent_lnk USING btree (folder_ord);


--
-- Name: upload_folders_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX upload_folders_updated_by_id_fk ON public.upload_folders USING btree (updated_by_id);


--
-- Name: vip_orders_buyer_lnk_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX vip_orders_buyer_lnk_fk ON public.vip_orders_buyer_lnk USING btree (vip_order_id);


--
-- Name: vip_orders_buyer_lnk_ifk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX vip_orders_buyer_lnk_ifk ON public.vip_orders_buyer_lnk USING btree (user_id);


--
-- Name: vip_orders_created_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX vip_orders_created_by_id_fk ON public.vip_orders USING btree (created_by_id);


--
-- Name: vip_orders_documents_idx; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX vip_orders_documents_idx ON public.vip_orders USING btree (document_id, locale, published_at);


--
-- Name: vip_orders_updated_by_id_fk; Type: INDEX; Schema: public; Owner: sitruyen
--

CREATE INDEX vip_orders_updated_by_id_fk ON public.vip_orders USING btree (updated_by_id);


--
-- Name: admin_permissions admin_permissions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: admin_permissions_role_lnk admin_permissions_role_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_permissions_role_lnk
    ADD CONSTRAINT admin_permissions_role_lnk_fk FOREIGN KEY (permission_id) REFERENCES public.admin_permissions(id) ON DELETE CASCADE;


--
-- Name: admin_permissions_role_lnk admin_permissions_role_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_permissions_role_lnk
    ADD CONSTRAINT admin_permissions_role_lnk_ifk FOREIGN KEY (role_id) REFERENCES public.admin_roles(id) ON DELETE CASCADE;


--
-- Name: admin_permissions admin_permissions_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: admin_roles admin_roles_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: admin_roles admin_roles_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: admin_users admin_users_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: admin_users_roles_lnk admin_users_roles_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_users_roles_lnk
    ADD CONSTRAINT admin_users_roles_lnk_fk FOREIGN KEY (user_id) REFERENCES public.admin_users(id) ON DELETE CASCADE;


--
-- Name: admin_users_roles_lnk admin_users_roles_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_users_roles_lnk
    ADD CONSTRAINT admin_users_roles_lnk_ifk FOREIGN KEY (role_id) REFERENCES public.admin_roles(id) ON DELETE CASCADE;


--
-- Name: admin_users admin_users_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: authors authors_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: authors authors_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: categories categories_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: categories_stories_lnk categories_stories_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.categories_stories_lnk
    ADD CONSTRAINT categories_stories_lnk_fk FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: categories_stories_lnk categories_stories_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.categories_stories_lnk
    ADD CONSTRAINT categories_stories_lnk_ifk FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: categories categories_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: chapters chapters_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: chapters_story_lnk chapters_story_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.chapters_story_lnk
    ADD CONSTRAINT chapters_story_lnk_fk FOREIGN KEY (chapter_id) REFERENCES public.chapters(id) ON DELETE CASCADE;


--
-- Name: chapters_story_lnk chapters_story_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.chapters_story_lnk
    ADD CONSTRAINT chapters_story_lnk_ifk FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: chapters chapters_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: comments_chapter_lnk comments_chapter_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_chapter_lnk
    ADD CONSTRAINT comments_chapter_lnk_fk FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: comments_chapter_lnk comments_chapter_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_chapter_lnk
    ADD CONSTRAINT comments_chapter_lnk_ifk FOREIGN KEY (chapter_id) REFERENCES public.chapters(id) ON DELETE CASCADE;


--
-- Name: comments comments_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: comments_parent_lnk comments_parent_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_parent_lnk
    ADD CONSTRAINT comments_parent_lnk_fk FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: comments_parent_lnk comments_parent_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_parent_lnk
    ADD CONSTRAINT comments_parent_lnk_ifk FOREIGN KEY (inv_comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: comments_sticker_lnk comments_sticker_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_sticker_lnk
    ADD CONSTRAINT comments_sticker_lnk_fk FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: comments_sticker_lnk comments_sticker_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_sticker_lnk
    ADD CONSTRAINT comments_sticker_lnk_ifk FOREIGN KEY (sticker_id) REFERENCES public.stickers(id) ON DELETE CASCADE;


--
-- Name: comments_story_lnk comments_story_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_story_lnk
    ADD CONSTRAINT comments_story_lnk_fk FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: comments_story_lnk comments_story_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_story_lnk
    ADD CONSTRAINT comments_story_lnk_ifk FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: comments comments_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: comments_user_lnk comments_user_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_user_lnk
    ADD CONSTRAINT comments_user_lnk_fk FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: comments_user_lnk comments_user_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.comments_user_lnk
    ADD CONSTRAINT comments_user_lnk_ifk FOREIGN KEY (user_id) REFERENCES public.up_users(id) ON DELETE CASCADE;


--
-- Name: files files_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: files_folder_lnk files_folder_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files_folder_lnk
    ADD CONSTRAINT files_folder_lnk_fk FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE;


--
-- Name: files_folder_lnk files_folder_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files_folder_lnk
    ADD CONSTRAINT files_folder_lnk_ifk FOREIGN KEY (folder_id) REFERENCES public.upload_folders(id) ON DELETE CASCADE;


--
-- Name: files_related_mph files_related_mph_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files_related_mph
    ADD CONSTRAINT files_related_mph_fk FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE;


--
-- Name: files files_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: follows follows_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: follows_story_lnk follows_story_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows_story_lnk
    ADD CONSTRAINT follows_story_lnk_fk FOREIGN KEY (follow_id) REFERENCES public.follows(id) ON DELETE CASCADE;


--
-- Name: follows_story_lnk follows_story_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows_story_lnk
    ADD CONSTRAINT follows_story_lnk_ifk FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: follows follows_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: follows_user_lnk follows_user_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows_user_lnk
    ADD CONSTRAINT follows_user_lnk_fk FOREIGN KEY (follow_id) REFERENCES public.follows(id) ON DELETE CASCADE;


--
-- Name: follows_user_lnk follows_user_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.follows_user_lnk
    ADD CONSTRAINT follows_user_lnk_ifk FOREIGN KEY (user_id) REFERENCES public.up_users(id) ON DELETE CASCADE;


--
-- Name: i18n_locale i18n_locale_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.i18n_locale
    ADD CONSTRAINT i18n_locale_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: i18n_locale i18n_locale_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.i18n_locale
    ADD CONSTRAINT i18n_locale_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: ratings ratings_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: ratings_story_lnk ratings_story_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings_story_lnk
    ADD CONSTRAINT ratings_story_lnk_fk FOREIGN KEY (rating_id) REFERENCES public.ratings(id) ON DELETE CASCADE;


--
-- Name: ratings_story_lnk ratings_story_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings_story_lnk
    ADD CONSTRAINT ratings_story_lnk_ifk FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: ratings_user_lnk ratings_user_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings_user_lnk
    ADD CONSTRAINT ratings_user_lnk_fk FOREIGN KEY (rating_id) REFERENCES public.ratings(id) ON DELETE CASCADE;


--
-- Name: ratings_user_lnk ratings_user_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.ratings_user_lnk
    ADD CONSTRAINT ratings_user_lnk_ifk FOREIGN KEY (user_id) REFERENCES public.up_users(id) ON DELETE CASCADE;


--
-- Name: reading-histories reading-histories_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public."reading-histories"
    ADD CONSTRAINT "reading-histories_created_by_id_fk" FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: reading-histories reading-histories_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public."reading-histories"
    ADD CONSTRAINT "reading-histories_updated_by_id_fk" FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: reading_histories_chapter_lnk reading_histories_chapter_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_chapter_lnk
    ADD CONSTRAINT reading_histories_chapter_lnk_fk FOREIGN KEY (reading_history_id) REFERENCES public."reading-histories"(id) ON DELETE CASCADE;


--
-- Name: reading_histories_chapter_lnk reading_histories_chapter_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_chapter_lnk
    ADD CONSTRAINT reading_histories_chapter_lnk_ifk FOREIGN KEY (chapter_id) REFERENCES public.chapters(id) ON DELETE CASCADE;


--
-- Name: reading_histories_story_lnk reading_histories_story_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_story_lnk
    ADD CONSTRAINT reading_histories_story_lnk_fk FOREIGN KEY (reading_history_id) REFERENCES public."reading-histories"(id) ON DELETE CASCADE;


--
-- Name: reading_histories_story_lnk reading_histories_story_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_story_lnk
    ADD CONSTRAINT reading_histories_story_lnk_ifk FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: reading_histories_user_lnk reading_histories_user_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_user_lnk
    ADD CONSTRAINT reading_histories_user_lnk_fk FOREIGN KEY (reading_history_id) REFERENCES public."reading-histories"(id) ON DELETE CASCADE;


--
-- Name: reading_histories_user_lnk reading_histories_user_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reading_histories_user_lnk
    ADD CONSTRAINT reading_histories_user_lnk_ifk FOREIGN KEY (user_id) REFERENCES public.up_users(id) ON DELETE CASCADE;


--
-- Name: reports reports_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: reports_reporter_lnk reports_reporter_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reports_reporter_lnk
    ADD CONSTRAINT reports_reporter_lnk_fk FOREIGN KEY (report_id) REFERENCES public.reports(id) ON DELETE CASCADE;


--
-- Name: reports_reporter_lnk reports_reporter_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reports_reporter_lnk
    ADD CONSTRAINT reports_reporter_lnk_ifk FOREIGN KEY (user_id) REFERENCES public.up_users(id) ON DELETE CASCADE;


--
-- Name: reports reports_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: sticker_packs sticker_packs_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.sticker_packs
    ADD CONSTRAINT sticker_packs_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: sticker_packs sticker_packs_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.sticker_packs
    ADD CONSTRAINT sticker_packs_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: stickers stickers_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stickers
    ADD CONSTRAINT stickers_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: stickers_pack_lnk stickers_pack_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stickers_pack_lnk
    ADD CONSTRAINT stickers_pack_lnk_fk FOREIGN KEY (sticker_id) REFERENCES public.stickers(id) ON DELETE CASCADE;


--
-- Name: stickers_pack_lnk stickers_pack_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stickers_pack_lnk
    ADD CONSTRAINT stickers_pack_lnk_ifk FOREIGN KEY (sticker_pack_id) REFERENCES public.sticker_packs(id) ON DELETE CASCADE;


--
-- Name: stickers stickers_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stickers
    ADD CONSTRAINT stickers_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: stories_author_lnk stories_author_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stories_author_lnk
    ADD CONSTRAINT stories_author_lnk_fk FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: stories_author_lnk stories_author_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stories_author_lnk
    ADD CONSTRAINT stories_author_lnk_ifk FOREIGN KEY (author_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: stories stories_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: stories stories_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_api_token_permissions strapi_api_token_permissions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_token_permissions
    ADD CONSTRAINT strapi_api_token_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_api_token_permissions_token_lnk strapi_api_token_permissions_token_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_token_permissions_token_lnk
    ADD CONSTRAINT strapi_api_token_permissions_token_lnk_fk FOREIGN KEY (api_token_permission_id) REFERENCES public.strapi_api_token_permissions(id) ON DELETE CASCADE;


--
-- Name: strapi_api_token_permissions_token_lnk strapi_api_token_permissions_token_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_token_permissions_token_lnk
    ADD CONSTRAINT strapi_api_token_permissions_token_lnk_ifk FOREIGN KEY (api_token_id) REFERENCES public.strapi_api_tokens(id) ON DELETE CASCADE;


--
-- Name: strapi_api_token_permissions strapi_api_token_permissions_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_token_permissions
    ADD CONSTRAINT strapi_api_token_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_api_tokens strapi_api_tokens_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_api_tokens strapi_api_tokens_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_history_versions strapi_history_versions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_history_versions
    ADD CONSTRAINT strapi_history_versions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_release_actions strapi_release_actions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_release_actions
    ADD CONSTRAINT strapi_release_actions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_release_actions_release_lnk strapi_release_actions_release_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_release_actions_release_lnk
    ADD CONSTRAINT strapi_release_actions_release_lnk_fk FOREIGN KEY (release_action_id) REFERENCES public.strapi_release_actions(id) ON DELETE CASCADE;


--
-- Name: strapi_release_actions_release_lnk strapi_release_actions_release_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_release_actions_release_lnk
    ADD CONSTRAINT strapi_release_actions_release_lnk_ifk FOREIGN KEY (release_id) REFERENCES public.strapi_releases(id) ON DELETE CASCADE;


--
-- Name: strapi_release_actions strapi_release_actions_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_release_actions
    ADD CONSTRAINT strapi_release_actions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_releases strapi_releases_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_releases
    ADD CONSTRAINT strapi_releases_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_releases strapi_releases_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_releases
    ADD CONSTRAINT strapi_releases_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_sessions strapi_sessions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_sessions
    ADD CONSTRAINT strapi_sessions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_sessions strapi_sessions_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_sessions
    ADD CONSTRAINT strapi_sessions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_transfer_token_permissions strapi_transfer_token_permissions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions
    ADD CONSTRAINT strapi_transfer_token_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_transfer_token_permissions_token_lnk strapi_transfer_token_permissions_token_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions_token_lnk
    ADD CONSTRAINT strapi_transfer_token_permissions_token_lnk_fk FOREIGN KEY (transfer_token_permission_id) REFERENCES public.strapi_transfer_token_permissions(id) ON DELETE CASCADE;


--
-- Name: strapi_transfer_token_permissions_token_lnk strapi_transfer_token_permissions_token_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions_token_lnk
    ADD CONSTRAINT strapi_transfer_token_permissions_token_lnk_ifk FOREIGN KEY (transfer_token_id) REFERENCES public.strapi_transfer_tokens(id) ON DELETE CASCADE;


--
-- Name: strapi_transfer_token_permissions strapi_transfer_token_permissions_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions
    ADD CONSTRAINT strapi_transfer_token_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_transfer_tokens strapi_transfer_tokens_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_tokens
    ADD CONSTRAINT strapi_transfer_tokens_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_transfer_tokens strapi_transfer_tokens_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_transfer_tokens
    ADD CONSTRAINT strapi_transfer_tokens_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_workflows strapi_workflows_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows
    ADD CONSTRAINT strapi_workflows_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_workflows_stage_required_to_publish_lnk strapi_workflows_stage_required_to_publish_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stage_required_to_publish_lnk
    ADD CONSTRAINT strapi_workflows_stage_required_to_publish_lnk_fk FOREIGN KEY (workflow_id) REFERENCES public.strapi_workflows(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows_stage_required_to_publish_lnk strapi_workflows_stage_required_to_publish_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stage_required_to_publish_lnk
    ADD CONSTRAINT strapi_workflows_stage_required_to_publish_lnk_ifk FOREIGN KEY (workflow_stage_id) REFERENCES public.strapi_workflows_stages(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows_stages strapi_workflows_stages_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages
    ADD CONSTRAINT strapi_workflows_stages_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_workflows_stages_permissions_lnk strapi_workflows_stages_permissions_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages_permissions_lnk
    ADD CONSTRAINT strapi_workflows_stages_permissions_lnk_fk FOREIGN KEY (workflow_stage_id) REFERENCES public.strapi_workflows_stages(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows_stages_permissions_lnk strapi_workflows_stages_permissions_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages_permissions_lnk
    ADD CONSTRAINT strapi_workflows_stages_permissions_lnk_ifk FOREIGN KEY (permission_id) REFERENCES public.admin_permissions(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows_stages strapi_workflows_stages_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages
    ADD CONSTRAINT strapi_workflows_stages_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_workflows_stages_workflow_lnk strapi_workflows_stages_workflow_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages_workflow_lnk
    ADD CONSTRAINT strapi_workflows_stages_workflow_lnk_fk FOREIGN KEY (workflow_stage_id) REFERENCES public.strapi_workflows_stages(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows_stages_workflow_lnk strapi_workflows_stages_workflow_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows_stages_workflow_lnk
    ADD CONSTRAINT strapi_workflows_stages_workflow_lnk_ifk FOREIGN KEY (workflow_id) REFERENCES public.strapi_workflows(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows strapi_workflows_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.strapi_workflows
    ADD CONSTRAINT strapi_workflows_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: tags tags_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: tags tags_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_permissions up_permissions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_permissions_role_lnk up_permissions_role_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_permissions_role_lnk
    ADD CONSTRAINT up_permissions_role_lnk_fk FOREIGN KEY (permission_id) REFERENCES public.up_permissions(id) ON DELETE CASCADE;


--
-- Name: up_permissions_role_lnk up_permissions_role_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_permissions_role_lnk
    ADD CONSTRAINT up_permissions_role_lnk_ifk FOREIGN KEY (role_id) REFERENCES public.up_roles(id) ON DELETE CASCADE;


--
-- Name: up_permissions up_permissions_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_roles up_roles_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_roles up_roles_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_users up_users_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_users_role_lnk up_users_role_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_users_role_lnk
    ADD CONSTRAINT up_users_role_lnk_fk FOREIGN KEY (user_id) REFERENCES public.up_users(id) ON DELETE CASCADE;


--
-- Name: up_users_role_lnk up_users_role_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_users_role_lnk
    ADD CONSTRAINT up_users_role_lnk_ifk FOREIGN KEY (role_id) REFERENCES public.up_roles(id) ON DELETE CASCADE;


--
-- Name: up_users up_users_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: upload_folders upload_folders_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: upload_folders_parent_lnk upload_folders_parent_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.upload_folders_parent_lnk
    ADD CONSTRAINT upload_folders_parent_lnk_fk FOREIGN KEY (folder_id) REFERENCES public.upload_folders(id) ON DELETE CASCADE;


--
-- Name: upload_folders_parent_lnk upload_folders_parent_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.upload_folders_parent_lnk
    ADD CONSTRAINT upload_folders_parent_lnk_ifk FOREIGN KEY (inv_folder_id) REFERENCES public.upload_folders(id) ON DELETE CASCADE;


--
-- Name: upload_folders upload_folders_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: vip_orders_buyer_lnk vip_orders_buyer_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.vip_orders_buyer_lnk
    ADD CONSTRAINT vip_orders_buyer_lnk_fk FOREIGN KEY (vip_order_id) REFERENCES public.vip_orders(id) ON DELETE CASCADE;


--
-- Name: vip_orders_buyer_lnk vip_orders_buyer_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.vip_orders_buyer_lnk
    ADD CONSTRAINT vip_orders_buyer_lnk_ifk FOREIGN KEY (user_id) REFERENCES public.up_users(id) ON DELETE CASCADE;


--
-- Name: vip_orders vip_orders_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.vip_orders
    ADD CONSTRAINT vip_orders_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: vip_orders vip_orders_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: sitruyen
--

ALTER TABLE ONLY public.vip_orders
    ADD CONSTRAINT vip_orders_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict fet9u56cWkNV87kbOowu2qUdDb2C55POBS3NzC7tMjbrY6jLwYuLTNM2S5byVwR

